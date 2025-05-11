import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';

const EF_RunCoreRecovery = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 100 }, (_, i) => i + 1);
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.runCoreRecovery || !values.runCoreRecovery[index]) {
            setFieldValue(`runCoreRecovery[${index}]`, valorInicial);
        }
    }, [index, values.runCoreRecovery, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Recuperação:</Text>
            <View style={styles.pickerView}>
                <Picker
                    selectedValue={values.runCoreRecovery?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`runCoreRecovery[${index}]`, itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="0%" value="0" />
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

export default EF_RunCoreRecovery;
