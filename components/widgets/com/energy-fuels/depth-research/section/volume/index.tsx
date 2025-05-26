import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';

const EF_Volume = ({ index, parent }) => {
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = 100;

    useEffect(() => {
        if (!values?.[parent]?.volume || !values?.[parent]?.volume[index]) {
            setFieldValue(`${parent}.volume[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.volume, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>Volume (m³):</Text>
            <View>
                <NumericInput 
                value={values?.[parent]?.volume?.[index] || valorInicial} 
                onChange={(text) => setFieldValue(`${parent}.volume[${index}]`, text)} />         
            </View>
        </View>
    );
};

export default EF_Volume;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});