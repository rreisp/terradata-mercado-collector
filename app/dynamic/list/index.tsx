import { useCallback, useState } from "react";
import { View, Text, Button, Image, StyleSheet, Pressable, FlatList, Alert, Platform, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import GlobalStyles from '@/core/constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { constants } from '@/core/constants/constants';

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

const DynamicList = ({ schemaId, onList, columns, onDelete, onReset, onExport, onExportAll }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const insets = useSafeAreaInsets();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isPT = language === 'pt-BR';

    useFocusEffect(
        useCallback(() => {
            loadSchema(schemaId);
            fetchRecords();
        }, [])
    );

    async function fetchRecords() {
        try {
            const data = await onList(language);
            setRecords(data);
        } catch (error) {
            console.error(isPT ? 'Erro ao carregar registros:' : 'Error loading records.', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadSchema(schemaId: string) {
        const timer = setTimeout(() => setLoading(false), constants.delay);
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
            const timer = setTimeout(() => setLoading(false), constants.delay);
            return () => clearTimeout(timer);
        }
    }

    async function handleDelete(rootItemId: number): Promise<void> {
        const doDelete = () => {
            onDelete(rootItemId);
            setRecords((prevRecords) => prevRecords.filter(record => record.id !== rootItemId));
        };

        const message = language === "pt-BR" ?
            `Tem certeza que deseja remover o item com o ID ${rootItemId}?` : `Are you sure you want to remove the item with ID ${rootItemId}?`;

        Alert.alert(
            'Confirmação de Exclusão',
            message,
            [
                { text: language === "pt-BR" ? 'Cancelar' : "Cancel", style: 'cancel' },
                { text: language === "pt-BR" ? 'Excluir' : "Remove", style: 'destructive', onPress: doDelete }
            ],
            { cancelable: true }
        );
    }

    async function handleEdit(id: number): Promise<void> {
        navigation.navigate('loader/form/index', { schemaId, editMode: true, itemId: id }, { pop: true });
    }

    async function handleExport(rootItemId: number): Promise<void> {
        setLoading(true);
        await onExport(rootItemId, language);
        setLoading(false);
    }

    async function handleExportAll(): Promise<void> {
        const doExportAll = async () => {
            setModalVisible(false);
            setLoading(true);
            await onExportAll(language);
            Alert.alert(isPT ? 'Registro exportado com sucesso!' : 'Record exported successfully!');
            setLoading(false);
        };

        Alert.alert(
            isPT ? 'Atenção!' : 'Atention!',
            isPT ? 'Esta operação pode demorar. Deseja continuar?' : 'This operation may take some time. Do you wish to continue?',
            [
                { text: language === "pt-BR" ? 'Cancelar' : "Cancel", style: 'cancel' },
                { text: language === "pt-BR" ? 'Confirmar' : "Ok", style: 'destructive', onPress: doExportAll }
            ],
            { cancelable: true }
        );
    }

    async function handleReset(): Promise<void> {
        const doReset = () => {
            setModalVisible(false);            
            onReset();
            setModalVisible(false);
            setRecords([]);
        };

        const msg = (isPT ? `Tem certeza que deseja apagar todos os registros?` : `Are you sure you want to delete all records?`);

        Alert.alert(
            (isPT ? `Atenção!` : `Atention!`),
            msg,
            [
                { text: (isPT ? `Cancelar` : `Cancel`), style: 'cancel' },
                { text: (isPT ? `Resetar` : `Reset`), style: 'destructive', onPress: doReset }
            ],
            { cancelable: true }
        );
    }

    const goBack = () => {
        navigation.navigate('tools/index', {}, { pop: true });
    };

    const openForm = () => {
        navigation.navigate('loader/form/index', { schemaId }, { pop: true });
    };

    const showOptions = () => {
        setModalVisible(true);
    };

    return (
        <SafeAreaContainer scrollable={false}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.row]}>
                    <View style={GlobalStyles.col2}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={goBack}>
                            <Icon name="chevron-circle-left" size={16} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={GlobalStyles.col8}></View>
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", marginRight: 2 }]}>
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
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", marginRight: 2 }]}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={openForm}>
                            <Icon name="plus" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                <View style={[GlobalStyles.row]}>
                    <View style={[GlobalStyles.col12]}>
                        <FlatList
                            data={records}
                            keyExtractor={(item) => item.id!.toString()}
                            renderItem={({ item }) => (
                                <View style={[GlobalStyles.row, { paddingVertical: 3 }]}>
                                    <View style={[GlobalStyles.col9]}>
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
                                    <View style={[GlobalStyles.col1, { marginRight: 2 }]}>
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={() => handleExport(item.id)}>
                                            <Icon name="save" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 2 }]}>
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={() => handleEdit(item.id)}>
                                            <Icon name="edit" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 2 }]}>
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
                            style={{ paddingRight: 4 }}
                        />
                    </View>
                </View>
            </View>

            <Modal isVisible={modalVisible} backdropColor="white" backdropOpacity={constants.opacity}>
                <View>
                    {/* <Text>{modalContent}</Text> */}

                    <View style={{ marginBottom: 12 }}>
                        <Button title={isPT ? "Exportar tudo" : "Export all"} onPress={handleExportAll} />
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Button title={isPT ? "Resetar" : "Reset"} onPress={handleReset} />
                    </View>

                    <Button title="Fechar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </SafeAreaContainer>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(255, 255, 255, ${constants.opacity})`,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
});

export default DynamicList;

