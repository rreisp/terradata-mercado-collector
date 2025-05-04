// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

const EF_Depth = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Profundidade {index + 1}:</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="De"
                    keyboardType="numeric"
                    value={values.depths?.[index]?.start || ''}
                    onChangeText={(text) => setFieldValue(`depths[${index}].start`, text)}
                />
                <TextInput
                    style={styles.input}
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
    container: { marginBottom: 10 },
    label: { fontWeight: 'bold', marginBottom: 3 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    input: { borderWidth: 1, borderRadius: 5, borderColor: '#ccc', padding: 8, flex: 1, marginHorizontal: 1 }
});

export default EF_Depth;
