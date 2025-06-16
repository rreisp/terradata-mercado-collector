import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Clay = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const [isChecked, setIsChecked] = useState(false);

    const valorInicial = 0;

    useEffect(() => {
        if (!values?.[parent]?.clayPct || !values?.[parent]?.clayPct[index]) {
            setFieldValue(`${parent}.clayPct[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.clayPct, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Argila:` : `Clay:`}</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`${parent}.clayPct[${index}]`, "0,5") :
                                setFieldValue(`${parent}.clayPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput
                        value={values?.[parent]?.clayPct?.[index] || valorInicial}
                        onChange={(text) => setFieldValue(`${parent}.clayPct[${index}]`, text)} disabled={!isChecked}
                    />
                </View>
            </View>
        </View>
    );
};
export default EF_Clay;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    checkbox: {
        flexDirection: 'row',
        marginRight: 5,
        paddingTop: 1
    },
});