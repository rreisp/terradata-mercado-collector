import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';

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
        <View style={styles.container}>
            <Text style={styles.label}>Umidade:</Text>
            <View style={styles.pickerView}>
                <Picker
                    selectedValue={values.moisture?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`moisture[${index}]`, itemValue)}
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

export default EF_Moisture;
