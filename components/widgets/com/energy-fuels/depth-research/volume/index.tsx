import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

const EF_Volume = ({index}) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Volume (m³):</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={values.volume?.[index] || ''}
                    onChangeText={(text) => setFieldValue(`volume`, text)}
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

export default EF_Volume;
