import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Grainsize = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext<any>();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Muito fina",
            "Fina",
            "Média",
            "Grossa",
            "Muito grossa",
            "Cascalho"
        ],
        "en-US": [
            "Select",
            "Very fine",
            "Fine",
            "Medium",
            "Coarse",
            "Very coarse",
            "Gravel"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);

    useEffect(() => {
        if (!values?.[parent]?.grainsize || !values?.[parent]?.grainsize[index]) {
            setFieldValue(`${parent}.grainsize[${index}]`, valorInicial);
        }
    }, []);

    const fieldError = errors?.[parent]?.grainsize?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Granulometria` : `Grainsize`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.grainsize?.[index] - 1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.grainsize[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Grainsize;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});