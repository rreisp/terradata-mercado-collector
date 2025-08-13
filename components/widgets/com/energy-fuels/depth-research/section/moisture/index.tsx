import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Moisture = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Molhada",
            "Úmida",
            "Seca"
        ],
        "en-US": [
            "Wet",
            "Moist",
            "Dry"
        ]
    };

    //const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]) + 1


    useEffect(() => {
        if (!values?.[parent]?.moisture || !values?.[parent]?.moisture[index]) {
            setFieldValue(`${parent}.moisture[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.moisture, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Umidade` : `Moisture`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={values?.[parent]?.moisture?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.moisture[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Moisture;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});