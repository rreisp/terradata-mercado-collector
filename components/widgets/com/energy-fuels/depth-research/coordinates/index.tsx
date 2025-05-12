// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Coordinates = () => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>Coordenada Leste:</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.easting || ''}
                    onChangeText={(text) => setFieldValue(`easting`, text)}
                />
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>Coordenada Norte:</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.northing || ''}
                    onChangeText={(text) => setFieldValue(`northing`, text)}
                />
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>Elevação:</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.elevation || ''}
                    onChangeText={(text) => setFieldValue(`elevation`, text)}
                />
            </View>            
        </View>
    );
};

export default EF_Coordinates;
