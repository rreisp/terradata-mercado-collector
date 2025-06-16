import { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, ScrollView, Pressable, FlatList } from "react-native";
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
import { CrudService } from "@/services/crud-service";
import { ImageRecord } from "@/types/image-record";

async function listImages(): Promise<ImageRecord[]> {
    const images = await CrudService.list<ImageRecord>('images');
    return images;
}

const DynamicList = ({ schemaId }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const insets = useSafeAreaInsets(); // <-- Novo
    const [images, setImages] = useState<ImageRecord[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        async function fetchImages() {
            try {
                const data = await listImages();
                setImages(data);
            } catch (error) {
                console.error('Erro ao carregar imagens:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchImages();
    }, []);

    const goBack = () => {
        navigation.navigate('tools/index', { formId: schemaId });
    };

    const openForm = () => {
        console.warn('schemaId:', schemaId, 'typeof:', typeof schemaId);
        navigation.navigate('loader/form/index', { formId: schemaId });
    };

    return (
        <SafeAreaContainer isLoading={loading} scrollable={false}>
            <View style={GlobalStyles.row}>
                <View style={GlobalStyles.col1}>
                    <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={goBack}>
                        <Icon name="chevron-circle-left" size={16} color="#fff" />
                    </Pressable>
                </View>
            </View>
            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col, styles.center]}>
                    <Image
                        source={require('../../../assets/images/EnergyFuels-Logo.png')}
                        style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                    />
                    <Text style={[GlobalStyles.title, GlobalStyles.centered]}>
                        {formSchema?.title[language] || ""} {String(language) === 'pt-BR' ? `LISTAGEM` : `LIST`}
                    </Text>
                </View>
            </View>
            <View style={GlobalStyles.row}>
                <View style={GlobalStyles.col11}></View>
                <View style={GlobalStyles.col1}>
                    <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={openForm}>
                        <Icon name="plus" size={16} color="#fff" />
                    </Pressable>
                </View>
            </View>
            <View style={GlobalStyles.row}>
                <View style={GlobalStyles.col12}>
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Image source={{ uri: `${item.img}` }} style={styles.image} />
                                <Text>Intervalo: {item.fgk_interval}</Text>
                            </View>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.center}>
                                <Text>Nenhuma imagem encontrada.</Text>
                            </View>
                        )}
                         style={{ marginBottom: 130}}
                    />
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 150,
        marginBottom: 8,
        borderRadius: 6,
    },
});

export default DynamicList;

