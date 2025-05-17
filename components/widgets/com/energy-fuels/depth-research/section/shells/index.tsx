import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import { Picker } from '@react-native-picker/picker';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Shells = ({ index }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const opcoes = Array.from({ length: 101 }, (_, i) => i);
    const valorInicial = false; // Primeiro valor disponível
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (!values.clay || !values.clay[index]) {
            setFieldValue(`clay[${index}]`, valorInicial);
        }
    }, [index, values.clay, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Conchas` : `Shells`}:</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`shellsPct[${index}]`, "0,50") :
                                setFieldValue(`shellsPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput value={values.shellsPct?.[index]} onChange={(text) => setFieldValue(`shellsPct[${index}]`, text)} disabled={!isChecked} />
                </View>
            </View>
        </View>
    );
};
export default EF_Shells;

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1, marginHorizontal: 1 },
    container: { marginTop: 10 },
    checkbox: {
        flexDirection: 'row',
    },
    left: {
        paddingLeft: 3
    }
});