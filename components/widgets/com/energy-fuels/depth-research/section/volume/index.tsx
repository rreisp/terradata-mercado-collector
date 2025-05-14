import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Volume = ({index}) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View>
            <Text style={[GlobalStyles.label, styles.label]}>Volume (m³):</Text>
            <View style={GlobalStyles.row}>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.volume?.[index] || ''}
                    onChangeText={(text) => setFieldValue(`volume`, text)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: { marginBottom: 3 },
});

export default EF_Volume;
