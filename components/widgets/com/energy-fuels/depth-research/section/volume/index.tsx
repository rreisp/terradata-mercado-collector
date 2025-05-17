import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';

const EF_Volume = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>Volume (m³):</Text>
            <View>
                <NumericInput value={values.volume?.[index]} onChange={(text) => setFieldValue(`volume[${index}]`, text)} />
            </View>
        </View>
    );
};

export default EF_Volume;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});