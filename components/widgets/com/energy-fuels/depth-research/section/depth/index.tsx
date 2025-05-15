// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';

const EF_Depth = ({ index, editable }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View>
            <Text style={GlobalStyles.label}>Profundidade (cm):</Text>
            <View style={GlobalStyles.row}>
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...(false ? {} : GlobalStyles.disabledInput)
                    }}
                    placeholder="De"
                    keyboardType="numeric"
                    value={values.depths?.[index]?.start}
                    onChangeText={(text) => setFieldValue(`depths[${index}].start`, text)}
                    editable={false}
                />
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...(editable ? {} : GlobalStyles.disabledInput)
                    }}
                    placeholder="Até"
                    keyboardType="numeric"
                    value={values.depths?.[index]?.end}
                    onChangeText={(text) => setFieldValue(`depths[${index}].end`, text)}
                    editable={editable}
                />
            </View>
        </View>
    );
};

export default EF_Depth;
