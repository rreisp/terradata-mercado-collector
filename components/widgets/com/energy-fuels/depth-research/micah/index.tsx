import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../constants/styles';
import { Picker } from '@react-native-picker/picker';

const EF_Micah = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 101 }, (_, i) => i);
    const valorInicial = false; // Primeiro valor disponível
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!values.micah || !values.micah[index]) {
            setFieldValue(`micah[${index}]`, valorInicial);
        }
    }, [index, values.micah, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={[GlobalStyles.label, styles.label]}>Mica:</Text>

            <View style={styles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                    {/* <Text style={styles.left}>
                        {isChecked ? 'Presente' : 'Ausente'}
                    </Text> */}
                </View>
                <View style={[GlobalStyles.pickerView, GlobalStyles.col11]}>
                    <Picker
                        selectedValue={values.micahPct?.[index] || valorInicial}
                        onValueChange={(itemValue) => setFieldValue(`micahPct[${index}]`, itemValue)}
                        style={GlobalStyles.picker}
                        enabled={isChecked}
                    >
                        <Picker.Item label="Less than 1%" value="0" />
                        {opcoes.map((val) => (
                            <Picker.Item key={val} label={`${val}%`} value={`${val}`} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
};
export default EF_Micah;

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1, marginHorizontal: 1 },
    container: { marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginHorizontal: 2,
    },
    checkbox: {
        flexDirection: 'row',
    },
    left: {
        paddingLeft: 3
    },
    label: {
        marginBottom: 3
    }
});