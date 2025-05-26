// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Dates = ({parent}) => {
    const { language } = useLanguage();    
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Início:" : "Start Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values?.[parent]?.start || ''}
                    onChangeText={(text) => setFieldValue(`${parent}.start`, text)}
                />
            </View>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Término:" : "End Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values?.[parent]?.end || ''}
                    onChangeText={(text) => setFieldValue(`${parent}.end`, text)}
                />
            </View>          
        </View>
    );
};

export default EF_Dates;
