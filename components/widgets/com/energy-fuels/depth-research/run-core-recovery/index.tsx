import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

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
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Recuperação:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.runCoreRecovery?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`runCoreRecovery[${index}]`, itemValue)}
                    style={GlobalStyles.picker}
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

export default EF_RunCoreRecovery;

const styles = StyleSheet.create({
    label: { marginBottom: 3 },
});