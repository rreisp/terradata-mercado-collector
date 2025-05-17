import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Color = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = {
        "pt-BR": [
            "Clara",
            "Escura",
            "Preta",
            "Marrom",
            "Marrom alaranjada",
            "Marrom avermelhada",
            "Vermelha amarronzada",
            "Vermelha",
            "Rosa",
            "Laranja avermelhada",
            "Laranja amarronzada",
            "Laranja",
            "Laranja amarelada",
            "Amarela",
            "Amarelo amarronzado",
            "Amarelo alaranjado",
            "Beige",
            "Creme",
            "Cinza",
            "Branco",
            "Branco amarelado",
            "Verde"
        ],
        "en-US": [
            "Light",
            "Dark",
            "Black",
            "Brown",
            "Orangish brown",
            "Reddish brown",
            "Brownish red",
            "Red",
            "Pink",
            "Reddish orange",
            "Brownish orange",
            "Orange",
            "Yellowish orange",
            "Yellow",
            "Brownish yellow",
            "Orangish yellow",
            "Beige",
            "Cream",
            "Gray",
            "White",
            "Yellowish white",
            "Green"
        ]
    };

    const valorInicial = opcoes[language][0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.color || !values.color[index]) {
            setFieldValue(`color[${index}]`, valorInicial);
        }
    }, [index, values.color, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Cor:` : `Color:`}</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.color?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`color[${index}]`, itemValue)}
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

export default EF_Color;
