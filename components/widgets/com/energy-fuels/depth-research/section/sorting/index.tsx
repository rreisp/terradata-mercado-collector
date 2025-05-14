import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Sorting = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Muito fraca",
        "Fraca",
        "Moderada",
        "Boa",
        "Muito boa"
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.sorting || !values.sorting[index]) {
            setFieldValue(`sorting[${index}]`, valorInicial);
        }
    }, [index, values.sorting, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Seletividade granulométrica:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.sorting?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`sorting[${index}]`, itemValue)}
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

export default EF_Sorting;

const styles = StyleSheet.create({
    label: { marginBottom: 4 },
});