import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Grainsize = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
const opcoes = [
  "Muito fina",
  "Fina",
  "Média",
  "Grossa",
  "Muito grossa",
  "Cascalho"
];
    const valorInicial = opcoes[0].toString(); // Primeiro valor disponível

    useEffect(() => {
        if (!values.grainsize || !values.grainsize[index]) {
            setFieldValue(`grainsize[${index}]`, valorInicial);
        }
    }, [index, values.grainsize, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Granulometria:</Text>
            <View style={GlobalStyles.pickerView}>
                <Picker
                    selectedValue={values.grainsize?.[index] || valorInicial}
                    onValueChange={(itemValue) => setFieldValue(`grainsize[${index}]`, itemValue)}
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

export default EF_Grainsize;
