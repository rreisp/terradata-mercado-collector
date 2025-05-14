import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Hardness = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Inconsolidada",
        "Esmagável com o dedo",
        "Nenhuma resistência a penetração",
        "Resistência a penetração",
        "Total resistência a penetração"
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.hardness || !values.hardness[index]) {
            setFieldValue(`hardness[${index}]`, valorInicial);
        }
    }, [index, values.hardness, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Dureza:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.hardness?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`hardness[${index}]`, itemValue)}
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

const styles = StyleSheet.create({
    label: { marginBottom: 3 },
});

export default EF_Hardness;
