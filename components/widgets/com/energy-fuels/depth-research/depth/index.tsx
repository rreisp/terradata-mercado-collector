// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Depth = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Profundidade:</Text>
            <View style={GlobalStyles.row}>
                <TextInput
                    style={GlobalStyles.input}
                    placeholder="De"
                    keyboardType="numeric"
                    value={values.depths?.[index]?.start || ''}
                    onChangeText={(text) => setFieldValue(`depths[${index}].start`, text)}
                />
                <TextInput
                    style={GlobalStyles.input}
                    placeholder="Até"
                    keyboardType="numeric"
                    value={values.depths?.[index]?.end || ''}
                    onChangeText={(text) => setFieldValue(`depths[${index}].end`, text)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: { marginBottom: 3 },
});

export default EF_Depth;
