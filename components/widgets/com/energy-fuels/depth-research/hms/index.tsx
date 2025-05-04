import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';

const EF_HMS = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 100 }, (_, i) => i + 1);
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.hms || !values.hms[index]) {
            setFieldValue(`hms[${index}]`, valorInicial);
        }
    }, [index, values.hms, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>%HMS:</Text>
            <View style={styles.pickerView}>
                <Picker
                    selectedValue={values.hms?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`hms[${index}]`, itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Less than 1%" value="0" />
                    {opcoes.map((val) => (
                        <Picker.Item key={val} label={`${val}%`} value={`${val}`} />
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

export default EF_HMS;
