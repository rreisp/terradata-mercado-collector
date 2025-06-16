import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import { Picker } from '@react-native-picker/picker';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_OrganicMatter = ({ index, parent }) => {
    const { language } = useLanguage();    
    const { values, setFieldValue } = useFormikContext();
    const [isChecked, setIsChecked] = useState(false);

    const valorInicial = 0;

    useEffect(() => {
        if (!values?.[parent]?.organicMatterPct || !values?.[parent]?.organicMatterPct[index]) {
            setFieldValue(`${parent}.organicMatterPct[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.organicMatterPct, setFieldValue, valorInicial]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Matéria Orgânica:` : `Organic Matter:`}</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`${parent}.organicMatterPct[${index}]`, "0,5") :
                                setFieldValue(`${parent}.organicMatterPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput 
                    value={values?.[parent]?.organicMatterPct?.[index] || valorInicial} 
                    onChange={(text) => setFieldValue(`${parent}.organicMatterPct[${index}]`, text)} disabled={!isChecked}                 
                     />
                </View>
            </View>
        </View>
    );
};
export default EF_OrganicMatter;

const styles = StyleSheet.create({
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
});