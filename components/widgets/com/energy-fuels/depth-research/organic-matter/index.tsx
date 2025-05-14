import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../constants/styles';
import { Picker } from '@react-native-picker/picker';
import NumericInput from '@/components/widgets/input/numeric';

const EF_OrganicMatter = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 101 }, (_, i) => i);
    const valorInicial = false; // Primeiro valor disponível
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!values.organicMatter || !values.organicMatter[index]) {
            setFieldValue(`organicMatter[${index}]`, valorInicial);
        }
    }, [index, values.organicMatter, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={[GlobalStyles.label, styles.label]}>Matéria Orgânica:</Text>

            <View style={styles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`organicMatterPct[${index}]`, "0,50") :
                                setFieldValue(`organicMatterPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput value={values.organicMatterPct?.[index]} onChange={(text) => setFieldValue(`organicMatterPct[${index}]`, text)} disabled={!isChecked} />
                </View>
            </View>
        </View>
    );
};
export default EF_OrganicMatter;

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