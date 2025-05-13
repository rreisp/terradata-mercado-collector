import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Roundness = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = [
        "Fraca",
        "Moderada",
        "Boa"
    ];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.roundness || !values.roundness[index]) {
            setFieldValue(`roundness[${index}]`, valorInicial);
        }
    }, [index, values.roundness, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Esfericidade:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.roundness?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`roundness[${index}]`, itemValue)}
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
    label: { marginBottom: 4 },
});

export default EF_Roundness;
