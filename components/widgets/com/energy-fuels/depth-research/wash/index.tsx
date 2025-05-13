import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Wash = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Fácil",
        "Moderada",
        "Difícil",
        "Muito difícil",
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.wash || !values.wash[index]) {
            setFieldValue(`wash[${index}]`, valorInicial);
        }
    }, [index, values.wash, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Deslamagem:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.wash?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`wash[${index}]`, itemValue)}
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

export default EF_Wash;
