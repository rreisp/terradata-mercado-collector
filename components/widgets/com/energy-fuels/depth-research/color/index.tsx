import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';

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
        <View style={styles.container}>
            <Text style={styles.label}>Cor:</Text>
            <View style={styles.pickerView}>
                <Picker
                    selectedValue={values.color?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`color[${index}]`, itemValue)}
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

export default EF_Color;
