// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Dates = () => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>Data de Início:</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.easting || ''}
                    onChangeText={(text) => setFieldValue(`easting`, text)}
                />
            </View>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>Data de Término:</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.northing || ''}
                    onChangeText={(text) => setFieldValue(`northing`, text)}
                />
            </View>          
        </View>
    );
};

export default EF_Dates;
