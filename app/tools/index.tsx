import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/types";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalStyles from '../../constants/styles';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../contexts/LanguageContext';
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
                                navigation.navigate('loader/index', { formId: itemValue });
                            }
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label={language === 'pt-BR' ? "SELECIONE" : "CHOOSE"} value={null} />
                        {availableForms.map((form) => (
                            <Picker.Item key={form.id} label={form.title} value={form.id} />
                        ))}
                    </Picker>
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
    picker: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: colors.white
    }
});

export default Tools;
