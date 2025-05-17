import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import Checkbox from 'expo-checkbox';
import GlobalStyles from '../../../../../../../constants/styles';
import { Picker } from '@react-native-picker/picker';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Micah = ({ index }) => {
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
        <View>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Mica:` : `Micah:`}</Text>

            <View style={GlobalStyles.row}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={() => {
                            !isChecked ?
                                setFieldValue(`micahPct[${index}]`, "0,5") :
                                setFieldValue(`micahPct[${index}]`, "0");
                            setIsChecked(!isChecked);
                        }}
                        color={isChecked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11]}>
                    <NumericInput value={values.micahPct?.[index]} onChange={(text) => setFieldValue(`micahPct[${index}]`, text)} disabled={!isChecked} />
                </View>
            </View>
        </View>
    );
};
export default EF_Micah;

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    checkbox: {
        flexDirection: 'row',
    },
    left: {
        paddingLeft: 3
    },
});