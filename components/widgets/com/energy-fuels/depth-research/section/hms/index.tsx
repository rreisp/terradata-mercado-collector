import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_HMS = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 100 }, (_, i) => i + 1);
    const valorInicial = "";

    useEffect(() => {
        if (!values.hms || !values.hms[index]) {
            setFieldValue(`hms[${index}]`, valorInicial);
        }
    }, [index, values.hms, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>%HMS:</Text>
            <View>
                <NumericInput step={0.1} value={values.hms?.[index]} onChange={(text) => setFieldValue(`hms[${index}]`, text)} />
            </View>
        </View>
    );
};

export default EF_HMS;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});