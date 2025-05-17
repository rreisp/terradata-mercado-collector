import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_RunCoreRecovery = ({ index }) => {
    const { language } = useLanguage();     
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = "";

    useEffect(() => {
        if (!values.runCoreRecovery || !values.runCoreRecovery[index]) {
            setFieldValue(`runCoreRecovery[${index}]`, valorInicial);
        }
    }, [index, values.runCoreRecovery, setFieldValue, valorInicial]);

    return (
        <View>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Recuperação` : `Recovery`}:</Text>
            <View>
                <NumericInput step={0.01} value={values.runCoreRecovery?.[index]} onChange={(text) => setFieldValue(`runCoreRecovery[${index}]`, text)} />
            </View>
        </View>
    );
};

export default EF_RunCoreRecovery;