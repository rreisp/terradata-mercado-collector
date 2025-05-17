import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/types";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalStyles from '../../constants/styles';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import { goBack } from "expo-router/build/global-state/routing";

type Form = {
    id: string;
    title: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'loader/index'>;

const Tools = () => {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [availableForms, setAvailableForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<string | undefined>();
    const navigation = useNavigation<NavigationProp>();

    const tools_text = {
        "en-US": "TOOLS",
        "pt-BR": "FERRAMENTAS",
    };

    const tools_details_text = {
        "en-US": "Choose a form to work",
        "pt-BR": "Escolha um formulário para trabalhar",
    };

    const goBack = () => {
        navigation.navigate('index');
    };

    useEffect(() => {
        const fetchFormConfig = async () => {
            try {
                // const response = await fetch('https://capturewise.terradata.com.br/list-json.php');
                // const json = await response.json();
                // TODO: ler lista de arquivos da pasta dynamic/schemas
                const tools = [
                    {
                        "id": "energy-fuels.perfuracao",
                        "title": (language === 'pt-BR' ? "Caracterização de perfuração" : "Drilling Characterization")
                    },
                    // {
                    //     "id": "energy-fuels.diario.sondagem",
                    //     "title": "ENERGY FUELS - Diário de Sondagem"
                    // },
                    // {
                    //     "id": "ef.depth",
                    //     "title": "ENERGY FUELS - Teste de Elementos Customizados"
                    // }
                ];
                setAvailableForms(tools);
            } catch (error) {
                console.error('Erro ao buscar configurações dos formulários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormConfig();
    }, []);

    return (
        <SafeAreaProvider>
            <View style={[GlobalStyles.container, styles.container]}>

                {loading ? (
                    <ActivityIndicator size="large" color="#00ff00" />
                ) : availableForms.length === 0 ? (
                    <Text>Nenhum formulário disponível.</Text>
                ) : (
                    <>
                        <SafeAreaView>
                            <Image
                                source={require('../../assets/images/EnergyFuels-Logo.png')}
                                style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                            />
                        </SafeAreaView>

                        <Text style={GlobalStyles.title}>{tools_text[language]}</Text>
                        <Text style={GlobalStyles.subtitle}>{tools_details_text[language]}</Text>
                        <Picker
                            selectedValue={selectedForm}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedForm(itemValue);
                                if (itemValue) {
                                    navigation.navigate('loader/list/index', { formId: itemValue });
                                }
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label={language === 'pt-BR' ? "SELECIONE" : "CHOOSE"} value={null} />
                            {availableForms.map((form) => (
                                <Picker.Item key={form.id} label={form.title} value={form.id} />
                            ))}
                        </Picker>

                        <View style={[GlobalStyles.row, styles.goBack]}>
                            <View style={GlobalStyles.col12}>
                                <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton]} onPress={goBack}>
                                    <Icon name="chevron-circle-left" size={16} color="#fff" />
                                </Pressable>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    goBack : {
        marginTop: 33
    },
    picker: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: colors.white
    }
});

export default Tools;
