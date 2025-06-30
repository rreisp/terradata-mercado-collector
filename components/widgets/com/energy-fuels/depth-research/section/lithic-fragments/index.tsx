import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_LithicFragments = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const [isChecked, setIsChecked] = useState(false);

    const valorInicial = 0;

    useEffect(() => {
        if (!values?.[parent]?.lithicFragmentsPct || !values?.[parent]?.lithicFragmentsPct[index]) {
            setFieldValue(`${parent}.lithicFragmentsPct[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.lithicFragmentsPct, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Fragmentos Líticos` : `Lithic Fragments`}:</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`${parent}.lithicFragmentsPct[${index}]`, "0,5") :
                                setFieldValue(`${parent}.lithicFragmentsPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11, {paddingRight: 9}]}>
                    <NumericInput 
                    value={values?.[parent]?.lithicFragmentsPct?.[index] || valorInicial} 
                    onChange={(text) => setFieldValue(`${parent}.lithicFragmentsPct[${index}]`, text)} disabled={!isChecked}                 
                     />
                </View>
            </View>
        </View>
    );
};
export default EF_LithicFragments;

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1, marginHorizontal: 1 },
    container: { marginTop: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginHorizontal: 2,
    },
    checkbox: {
        flexDirection: 'row',
        marginRight: 5,
        paddingTop: 1
    },
    label: {
        marginBottom: 3
    }
});