import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Color = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
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
    ];

    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.color || !values.color[index]) {
            setFieldValue(`color[${index}]`, valorInicial);
        }
    }, [index, values.color, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>Cor:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.color?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`color[${index}]`, itemValue)}
                    style={GlobalStyles.picker}
                >
                    {opcoes.map((val) => (
                        <Picker.Item key={val} label={`${val}`} value={`${val}`} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default EF_Color;
