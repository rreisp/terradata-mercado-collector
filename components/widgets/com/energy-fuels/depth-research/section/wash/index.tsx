import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Wash = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Fácil",
            "Moderada",
            "Difícil",
            "Muito difícil"
        ],
        "en-US": [
            "Easy",
            "Moderate",
            "Hard",
            "Very hard"
        ]
    };

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.wash || !values.wash[index]) {
            setFieldValue(`wash[${index}]`, valorInicial);
        }
    }, [index, values.wash, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Deslamagem` : `Wash`}:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.wash?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`wash[${index}]`, itemValue)}
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

export default EF_Wash;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});