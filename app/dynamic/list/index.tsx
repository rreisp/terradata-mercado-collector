import { useCallback, useState } from "react";
import { View, Text, Button, Image, StyleSheet, Pressable, FlatList, Alert, Platform } from "react-native";
import Modal from "react-native-modal";
import GlobalStyles from '@/core/constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { values } from '@/core/constants/values';

import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "@/core/contexts/LanguageContext";
import { useOperationMode } from "@/core/contexts/OperationModeContext";
import { FormSchema } from "@/core/types/form-schema";
import { DynamicListProps } from "@/core/types/dynamic-list-props";

import schemaRegistry from "@/app-instance/schemas";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaContainer from "@/core/components/safe-container";
import { useFocusEffect } from '@react-navigation/native';
import { logos } from '@/app-instance/logos';
import * as ExportCsvService from '@/core/services/export-csv.service';

function formatDate(date: string, lang: string) {
    const day = date.substring(0, 2);
    const mth = date.substring(3, 5);
    const year = date.substring(6, 10);
    if (lang === "pt-BR") {
        return day + "/" + mth + "/" + year;
    } else {
        return mth + "/" + day + "/" + year;
    }
}

const DynamicList = ({ schemaId, onList, columns, onDelete, onReset }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const insets = useSafeAreaInsets();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchRecords() {
        try {
            const data = await onList();
            setRecords(data);
        } catch (error) {
            console.error(language === 'pt-BR' ? 'Erro ao carregar registros:' : 'Error loading records.', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadSchema(schemaId: string) {
        const timer = setTimeout(() => setLoading(false), values.delay);
        // Icon.loadFont();
        if (isOnline) {
            fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormSchema(data);
                    return () => clearTimeout(timer);
                })
                .catch((err) => console.error("Erro ao carregar schema:", err));
        } else {
            const schema = schemaRegistry[schemaId];
            // console.log(schema);
            setFormSchema(schema);
            const timer = setTimeout(() => setLoading(false), values.delay);
            return () => clearTimeout(timer);
        }
    }

    async function handleDelete(rootItemId: number): Promise<void> {
        const confirmAndDelete = () => {
            onDelete(rootItemId);
            setRecords((prevRecords) => prevRecords.filter(record => record.id !== rootItemId));
        };

        const message = language === "pt-BR" ?
            `Tem certeza que deseja remover o item com o ID ${rootItemId}?` : `Are you sure you want to remove the item with ID ${rootItemId}?`;

        if (Platform.OS === 'web') {
            const confirmed = window.confirm(message);
            if (confirmed) {
                confirmAndDelete();
            }
        } else {
            Alert.alert(
                'Confirmação de Exclusão',
                message,
                [
                    { text: language === "pt-BR" ? 'Cancelar' : "Cancel", style: 'cancel' },
                    { text: language === "pt-BR" ? 'Excluir' : "Remove", style: 'destructive', onPress: confirmAndDelete }
                ],
                { cancelable: true }
            );
        }
    }

    async function handleEdit(id: number): Promise<void> {
        // Alert.alert('Editar item', `ID do item: ${id}`);
        navigation.navigate('loader/form/index', { schemaId, editMode: true, itemId: id }, { pop: true });
    }

    async function handleExport(table: string, id: number): Promise<void> {
        try {
            const resultCsv = await ExportCsvService.exportTableToCSV(table, id);            
            console.log(resultCsv);           
            const resultImgs = await ExportCsvService.saveImagesFromTable('export_images', id);
            const resultZip = await ExportCsvService.exportZIP(resultCsv, `${table}.csv`, resultImgs);
            console.log(resultZip);
            // console.log(`Registro com ID ${id} removido com sucesso.`);
            // Alert.alert('Sucesso', `Registro com ID ${id} foi removido.`);
        } catch (error) {
            console.error('Erro ao exportar', error);
            // O tratamento de erro já está dentro do CrudService.delete
        }
    }    

    async function handleReset(): Promise<void> {
        const reset = () => {
            onReset();
            setModalVisible(false);
            setRecords([]);
        };

        const msg = (language === 'pt-BR' ? `Tem certeza que deseja apagar todos os registros?` : `Are you sure you want to delete all records?`);

        Alert.alert(
            (language === 'pt-BR' ? `Confirmação` : `Confirmation`),
            msg,
            [
                { text: (language === 'pt-BR' ? `Cancelar` : `Cancel`), style: 'cancel' },
                { text: (language === 'pt-BR' ? `Remover` : `Delete`), style: 'destructive', onPress: reset }
            ],
            { cancelable: true }
        );
    }

    useFocusEffect(
        useCallback(() => {
            loadSchema(schemaId);
            fetchRecords();
        }, [])
    );

    const goBack = () => {
        navigation.navigate('tools/index', {}, { pop: true });
    };

    const openForm = () => {
        navigation.navigate('loader/form/index', { schemaId }, { pop: true });
    };

    const showOptions = () => {
        setModalContent("opa");
        setModalVisible(true);
    };

    return (
        <SafeAreaContainer scrollable={false}>
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.row]}>
                    <View style={GlobalStyles.col2}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={goBack}>
                            <Icon name="chevron-circle-left" size={16} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={GlobalStyles.col8}></View>
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", paddingRight: 12 }]}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={showOptions}>
                            <Icon name="gear" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                <View style={[GlobalStyles.row]}>
                    <View style={[GlobalStyles.col12, styles.center]}>
                        <Image
                            // source={require(`../../../assets/images/${formSchema?.logo || ""}`)}
                            source={logos[schemaId]}
                            style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                        />
                        <Text style={GlobalStyles.title}>{formSchema?.title[language] || ""}</Text>
                    </View>
                </View>

                <View style={GlobalStyles.row}>
                    <View style={GlobalStyles.col10}></View>
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", paddingRight: 7 }]}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={openForm}>
                            <Icon name="plus" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                <View style={[GlobalStyles.row, { flex: 1 }]}>
                    <View style={[GlobalStyles.col12, { flex: 1 }]}>
                        <FlatList
                            data={records}
                            keyExtractor={(item) => item.id!.toString()}
                            renderItem={({ item }) => (
                                <View style={[GlobalStyles.row, { paddingVertical: 3 }]}>
                                    {/* <View style={GlobalStyles.col1}>
                                        <Text>{item.id}</Text>
                                    </View> */}
                                    <View style={[GlobalStyles.col9, { marginRight: 1 }]}>
                                        <View style={[GlobalStyles.row]}>
                                            {columns.map((field, index) => {
                                                const colStyle = {
                                                    flex: 1 / columns.length,
                                                    marginRight: 2
                                                };

                                                return (
                                                    <View key={index} style={[GlobalStyles.col, colStyle]}>
                                                        <Text>{item[field]}</Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 1 }]}>
                                        {/* <Image source={{ uri: `${item.img}` }} style={styles.image} /> */}
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={() => handleExport('export',item.id)}>
                                            <Icon name="save" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 1 }]}>
                                        {/* <Image source={{ uri: `${item.img}` }} style={styles.image} /> */}
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={() => handleEdit(item.id)}>
                                            <Icon name="edit" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 0 }]}>
                                        {/* <Image source={{ uri: `${item.img}` }} style={styles.image} /> */}
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.warnButton, GlobalStyles.iconButton]} onPress={() => handleDelete(item.id)}>
                                            <Icon name="trash" size={16} color="red" />
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.center}>
                                    <Text>Nenhum registro encontrado.</Text>
                                </View>
                            )}
                            style={{ paddingRight: 14, flex: 1 }}
                        />
                    </View>
                </View>
            </View>
            <Modal isVisible={modalVisible}>
                <View style={styles.modal}>
                    {/* <Text>{modalContent}</Text> */}
                    <View style={{ marginBottom: 12 }}>
                        <Button title="Resetar" onPress={handleReset} />
                    </View>

                    <Button title="Fechar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </SafeAreaContainer>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DynamicList;

