import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
const EF_HMS = ({ index, parent }) => {
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = 0;

    useEffect(() => {
        if (!values?.[parent]?.hms || !values?.[parent]?.hms[index]) {
            setFieldValue(`${parent}.hms[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.hms, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>%HMS:</Text>
            <View>
                <NumericInput step={0.1}
                    value={values?.[parent]?.hms?.[index] || valorInicial}
                    onChange={(text) => setFieldValue(`${parent}.hms[${index}]`, text)} />
            </View>
        </View>
    );
};

export default EF_HMS;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});