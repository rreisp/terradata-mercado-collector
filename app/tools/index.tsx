import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // ou FontAwesome5, se quiser usar a versão 5
import { colors } from '@/core/constants/colors';
import { constants } from "@/core/constants/constants";
import { OperationModeProvider, useOperationMode } from "@/core/contexts/OperationModeContext";
import { Tool } from "@/core/types/tool";
import SafeAreaContainer from "@/core/components/safe-container";
import { Form } from "@/core/types/form";

import schemaRegistry from "@/app-instance/schemas";

const Tools = () => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const [availableForms, setAvailableForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<string | undefined>();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const tools_text = {
        "en-US": "TOOLS",
        "pt-BR": "FERRAMENTAS",
    };

    const tools_details_text = {
        "en-US": "Choose a form to work",
        "pt-BR": "Escolha um formulário para trabalhar",
    };


    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), constants.delay);

        return () => clearTimeout(timer);
    }, []);

    const goBack = () => {
        // navigation.navigateDeprecated('index');
        navigation.navigate('index', {}, { pop: true });
    };

    useEffect(() => {
        Icon.loadFont();
        let tools: Tool[] = [];

        if (!isOnline) {
            Object.entries(schemaRegistry).forEach(([schemaId, schema]) => {
                tools.push({
                    "id": schemaId,
                    "title": schema.title[language]
                });
            });
            setAvailableForms(tools);
        } else {
            const fetchFormConfig = async () => {
                try {
                    const response = await fetch('https://capturewise.terradata.com.br/list-json.php');
                    tools = await response.json();
                    setAvailableForms(tools);
                } catch (error) {
                    console.error('Erro ao buscar configurações dos formulários:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchFormConfig();
        }
        setAvailableForms(tools);
        const timer = setTimeout(() => setLoading(false), constants.delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaContainer isLoading={loading}>
            <OperationModeProvider>
                <View style={[GlobalStyles.container, styles.container]}>
                    {availableForms.length === 0 ? (
                        <Text>{(language === 'pt-BR' ? "Nenhum formulário disponível" : "No form available")}.</Text>
                    ) : (
                        <>
                            <SafeAreaView>
                                <Image
                                    source={require('../../assets/images/logo.png')}
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
                                        // navigation.navigateDeprecated('loader/list/index', { schemaId: itemValue });
                                        navigation.navigate('loader/list/index', { schemaId: itemValue }, { pop: true });
                                    }
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label={language === 'pt-BR' ? "SELECIONE UMA FERRAMENTA" : "CHOOSE A TOOL"} value={null} />
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
            </OperationModeProvider>
        </SafeAreaContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    goBack: {
        marginTop: 33
    },
    picker: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: colors.white,
        color: "#000"
    }
});

export default Tools;
