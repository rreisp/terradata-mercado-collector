import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Sorting = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Muito fraca",
            "Fraca",
            "Moderada",
            "Boa",
            "Muito boa"
        ],
        "en-US": [
            "Very weak",
            "Weak",
            "Moderate",
            "Good",
            "Very good"
        ]
    };

    // const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível
    const valorInicial = opcoes[language].indexOf(opcoes[language][0]) + 1

    useEffect(() => {
        if (!values?.[parent]?.sorting || !values?.[parent]?.sorting[index]) {
            setFieldValue(`${parent}.sorting[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.sorting, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Seletividade granulométrica` : `Sorting`}:</Text>
            <View style={[GlobalStyles.pickerView, GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={values?.[parent]?.sorting?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.sorting[${index}]`, opcoes[language].indexOf(itemValue) + 1)}
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

export default EF_Sorting;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});