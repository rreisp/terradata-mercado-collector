import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

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
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>%HMS:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.hms?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`hms[${index}]`, itemValue)}
                    style={GlobalStyles.picker}
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
    label: { marginBottom: 3 },
});

export default EF_HMS;
