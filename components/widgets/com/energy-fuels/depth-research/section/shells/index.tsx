import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Shells = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const [isChecked, setIsChecked] = useState(false);

    const valorInicial = 0;

    useEffect(() => {
        if (!values?.[parent]?.shellsPct || !values?.[parent]?.shellsPct[index]) {
            setFieldValue(`${parent}.shellsPct[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.shellsPct, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Conchas:` : `Shells:`}</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`${parent}.shellsPct[${index}]`, "0,5") :
                                setFieldValue(`${parent}.shellsPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput 
                    value={values?.[parent]?.shellsPct?.[index] || valorInicial} 
                    onChange={(text) => setFieldValue(`${parent}.shellsPct[${index}]`, text)} disabled={!isChecked}                 
                     />
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
        marginRight: 5,
        paddingTop: 1
    },
});