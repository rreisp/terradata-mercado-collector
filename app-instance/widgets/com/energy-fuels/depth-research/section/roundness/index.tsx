import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Roundness = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Fraca",
            "Moderada",
            "Boa"
        ],
        "en-US": [
            "Select",
            "Weak",
            "Moderate",
            "Good"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);
    
    useEffect(() => {
        if (!values?.[parent]?.roundness || !values?.[parent]?.roundness[index]) {
            setFieldValue(`${parent}.roundness[${index}]`, valorInicial);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Esfericidade` : `Roundness`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.roundness?.[index]-1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.roundness[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
                    style={GlobalStyles.picker}
                >
                    {opcoes[language].map((val) => (
                        <Picker.Item key={val} label={`${val}`} value={`${val}`} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default EF_Roundness;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    checkbox: {
        flexDirection: 'row',
    },
    left: {
        paddingLeft: 3
    },
});