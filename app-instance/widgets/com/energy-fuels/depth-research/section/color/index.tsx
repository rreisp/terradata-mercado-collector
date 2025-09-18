import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Color = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Selecione",
            "Cinza",
            "Cinza Clara",
            "Cinza Escura",
            "Clara",
            "Escura",
            "Preta",
            "Marrom",
            "Marrom Clara",
            "Marrom Escura",
            "Marrom Alaranjada",
            "Marrom Avermelhada",
            "Vermelha Amarronzada",
            "Vermelha",
            "Vermelha Clara",
            "Rosa",
            "Rosa Clara",
            "Laranja Avermelhada",
            "Laranja Amarronzada",
            "Laranja",
            "Laranja Clara",            
            "Laranja Amarelada",
            "Amarela",
            "Amarela Clara",
            "Amarela Amarronzada",
            "Amarela Alaranjada",
            "Bege",
            "Bege Clara",
            "Creme",
            "Cinza Amarronzada",
            "Marrom Acizentada",
            "Cinza Esverdeada",
            "Branca",
            "Branca Amarelada",
            "Verde"
        ],
        "en-US": [
            "Select",
            "Gray",
            "Light Gray",
            "Dark Gray",
            "Light",
            "Dark",
            "Black",
            "Brown",
            "Light Brown",
            "Dark Brown",
            "Orangish Brown",
            "Reddish Brown",
            "Brownish Red",
            "Red",
            "Light Red",
            "Pink",
            "Light Pink",
            "Reddish Orange",
            "Brownish Orange",
            "Orange",
            "Light Orange",
            "Yellowish Orange",
            "Yellow",
            "Light Yellow",
            "Brownish Yellow",
            "Orangish Yellow",
            "Beige",
            "Light Beige",
            "Cream",
            "Brownish Gray",
            "Grayish Brown",
            "Greenish Gray",
            "White",
            "Yellowish White",
            "Green"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]);

    const fieldError = errors?.[parent]?.color?.[index];

    useEffect(() => {
        if (!values?.[parent]?.color || !values?.[parent]?.color[index]) {
            setFieldValue(`${parent}.color[${index}]`, valorInicial);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Cor` : `Color`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={opcoes[language][values?.[parent]?.color?.[index] - 1] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.color[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Color;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
