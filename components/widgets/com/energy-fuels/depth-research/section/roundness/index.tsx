import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Roundness = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Fraca",
            "Moderada",
            "Boa"
        ],
        "en-US": [
            "Weak",
            "Moderate",
            "Good"
        ]
    };

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.roundness || !values.roundness[index]) {
            setFieldValue(`roundness[${index}]`, valorInicial);
        }
    }, [index, values.roundness, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Esfericidade` : `Roundness`}:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.roundness?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`roundness[${index}]`, itemValue)}
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
