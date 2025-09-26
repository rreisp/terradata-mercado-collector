import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Induration = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Nenhuma",
            "Calcária",
            "Arenosa",
            "Ferro"
        ],
        "en-US": [
            "Select",
            "None",            
            "Limestone",
            "Sandy",
            "Iron"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);

    useEffect(() => {
        if (!values?.[parent]?.induration || !values?.[parent]?.induration[index]) {
            setFieldValue(`${parent}.induration[${index}]`, valorInicial);
        }
    }, []);

    const fieldError = errors?.[parent]?.induration?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Cimentação` : `Induration`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.induration?.[index] - 1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.induration[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Induration;


const styles = StyleSheet.create({
    container: { marginTop: 5 },
});