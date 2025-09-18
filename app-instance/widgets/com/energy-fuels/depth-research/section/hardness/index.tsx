import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Hardness = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Inconsolidada",
            "Esmagável com o dedo",
            "Nenhuma resistência a penetração",
            "Resistência a penetração",
            "Total resistência a penetração"
        ],
        "en-US": [
            "Select",
            "Unconsolidated",
            "Crushable with finger",
            "No resistance to penetration",
            "Resistance to penetration",
            "Total resistance to penetration"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);

    useEffect(() => {
        if (!values?.[parent]?.hardness || !values?.[parent]?.hardness[index]) {
            setFieldValue(`${parent}.hardness[${index}]`, valorInicial);
        }
    }, []);

    const fieldError = errors?.[parent]?.hardness?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Dureza` : `Hardness`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.hardness?.[index] - 1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.hardness[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
                    style={GlobalStyles.picker}
                >
                    {opcoes[language].map((val) => (
                        <Picker.Item key={val} label={`${val}`} value={`${val}`} />
                    ))}
                </Picker>
            </View>
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};


export default EF_Hardness;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});