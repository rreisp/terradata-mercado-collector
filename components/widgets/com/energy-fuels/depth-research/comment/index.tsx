import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';

const EF_Notas = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            <Text style={[GlobalStyles.label, styles.label]}>Comentários:</Text>
            <TextInput
                style={styles.textarea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={values.colorNotas?.[index] || ''}
                onChangeText={(text) => setFieldValue(`colorNotas[${index}]`, text)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    label: { marginBottom: 3 },
    textarea: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5 },
});

export default EF_Notas;
