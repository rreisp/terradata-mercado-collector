import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Induration = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Calcária",
        "Arenosa",
        "Ferro"
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.induration || !values.induration[index]) {
            setFieldValue(`induration[${index}]`, valorInicial);
        }
    }, [index, values.induration, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Cimentação:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.induration?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`induration[${index}]`, itemValue)}
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

export default EF_Induration;
