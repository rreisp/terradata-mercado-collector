import { useCallback, useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, Pressable, FlatList } from "react-native";
import Modal from "react-native-modal";
import GlobalStyles from '../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { values } from '../../../constants/values';

import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { useOperationMode } from "@/contexts/OperationModeContext";
import { FormSchema } from "@/types/form-schema";
import { DynamicListProps } from "@/types/dynamic-list-props";

import PerfuracaoSchema from '../../../schemas/energy-fuels.perfuracao.json';
import CadastroSchema from '../../../schemas/cw.dialeto.cadastro.json';

import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- Importação nova
import SafeAreaContainer from "@/components/safe-container";
import { CrudService } from "@/services/crud.service";
import { DrillingRecord } from "@/types/drilling-record";
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

async function listDrillings(): Promise<DrillingRecord[]> {
    const drillings = await CrudService.list<DrillingRecord>('drillings');
    return drillings;
}

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

export async function handleDelete(id: number): Promise<void> {
    Alert.alert('Remover item', `ID do item: ${id}`);
    try {
        await CrudService.delete('drillings', 'id = ?', [id]);
        console.log(`Registro com ID ${id} removido com sucesso.`);
        Alert.alert('Sucesso', `Registro com ID ${id} foi removido.`);
    } catch (error) {
        console.error('Erro ao remover o registro:', error);
        // O tratamento de erro já está dentro do CrudService.delete
    }
}


const DynamicList = ({ schemaId }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const insets = useSafeAreaInsets(); // <-- Novo
    // const [images, setImages] = useState<ImageRecord[]>([]);
    const [drillings, setDrillings] = useState<DrillingRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            async function fetchDrillingInfo() {
                try {
                    const data = await listDrillings();
                    setDrillings(data);
                } catch (error) {
                    console.error('Erro ao carregar registros:', error);
                } finally {
                    setLoading(false);
                }
            }
            fetchDrillingInfo();
        }, [])
    );

    useEffect(() => {
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
            let schema = null;
            switch (schemaId) {
                case 'cw.dialeto.cadastro':
                    schema = CadastroSchema;
                    break;
                case 'energy-fuels.perfuracao':
                    schema = PerfuracaoSchema;
                    break;
            }
            setFormSchema(schema);
            const timer = setTimeout(() => setLoading(false), values.delay);
            return () => clearTimeout(timer);
        }
    }, [schemaId]);

    const goBack = () => {
        navigation.navigate('tools/index', { formId: schemaId });
    };

    const openForm = () => {
        console.warn('schemaId:', schemaId, 'typeof:', typeof schemaId);
        navigation.navigate('loader/form/index', { formId: schemaId });
    };

    return (
        <SafeAreaContainer scrollable={false}>
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.row]}>
                    <View style={GlobalStyles.col12}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={goBack}>
                            <Icon name="chevron-circle-left" size={16} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={GlobalStyles.col11}></View>
                </View>

                <View style={[GlobalStyles.row]}>
                    <View style={[GlobalStyles.col12, styles.center]}>
                        <Image
                            source={require('../../../assets/images/EnergyFuels-Logo.png')}
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
                            data={drillings}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={[GlobalStyles.row, { paddingVertical: 3 }]}>
                                    <View style={GlobalStyles.col5}>
                                        <Text>{item.title}</Text>
                                    </View>
                                    <View style={GlobalStyles.col5}>
                                        <Text>{formatDate(item.start_date, language)} a {formatDate(item.end_date, language)}</Text>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 1 }]}>
                                        {/* <Image source={{ uri: `${item.img}` }} style={styles.image} /> */}
                                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={openForm}>
                                            <Icon name="save" size={16} color="white" />
                                        </Pressable>
                                    </View>
                                    <View style={[GlobalStyles.col1, { marginRight: 1 }]}>
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
                            style={{ paddingRight: 14, flex: 1}}
                        />
                    </View>
                </View>
            </View>
            <Modal isVisible={modalVisible}>
                <View style={styles.modal}>
                    <Text>{modalContent}</Text>
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

