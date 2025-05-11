import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';

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
        <View style={styles.container}>
            <Text style={styles.label}>Seletividade granulométrica:</Text>
            <View style={styles.pickerView}>
                <Picker
                    selectedValue={values.sorting?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`sorting[${index}]`, itemValue)}
                    style={styles.picker}
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
    container: { marginBottom: 10 },
    label: { fontWeight: 'bold', marginBottom: 4 },
    pickerView: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    picker: { padding: 8, borderWidth: 0 }
});

export default EF_Sorting;
