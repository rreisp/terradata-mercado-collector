import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Induration = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Calcária",
            "Arenosa",
            "Ferro"
        ],
        "en-US": [
            "Limestone",
            "Sandy",
            "Iron"
        ]
    };

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.induration || !values.induration[index]) {
            setFieldValue(`induration[${index}]`, valorInicial);
        }
    }, [index, values.induration, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Cimentação` : `Induration`}:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.induration?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`induration[${index}]`, itemValue)}
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

export default EF_Induration;


const styles = StyleSheet.create({
    container: { marginTop: 5 },
});