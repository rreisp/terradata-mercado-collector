import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Sorting = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Muito fraca",
            "Fraca",
            "Moderada",
            "Boa",
            "Muito boa"
        ],
        "en-US": [
            "Select",
            "Very weak",
            "Weak",
            "Moderate",
            "Good",
            "Very good"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);

    const fieldError = errors?.[parent]?.sorting?.[index];

    useEffect(() => {
        if (!values?.[parent]?.sorting || !values?.[parent]?.sorting[index]) {
            setFieldValue(`${parent}.sorting[${index}]`, valorInicial);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Seletividade granulométrica` : `Sorting`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.sorting?.[index] - 1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.sorting[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Sorting;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});