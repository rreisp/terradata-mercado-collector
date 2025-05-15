import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Moisture = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Molhada",
        "Úmida",
        "Seca"
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.moisture || !values.moisture[index]) {
            setFieldValue(`moisture[${index}]`, valorInicial);
        }
    }, [index, values.moisture, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>Umidade:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.moisture?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`moisture[${index}]`, itemValue)}
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

export default EF_Moisture;