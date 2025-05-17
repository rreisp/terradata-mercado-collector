import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Sorting = ({ index }) => {
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

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.sorting || !values.sorting[index]) {
            setFieldValue(`sorting[${index}]`, valorInicial);
        }
    }, [index, values.sorting, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Seletividade granulométrica` : `Sorting`}:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.sorting?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`sorting[${index}]`, itemValue)}
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