// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Dates = () => {
    const { language } = useLanguage();    
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Início:" : "Start Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.easting || ''}
                    onChangeText={(text) => setFieldValue(`start`, text)}
                />
            </View>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Término:" : "End Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values.northing || ''}
                    onChangeText={(text) => setFieldValue(`end`, text)}
                />
            </View>          
        </View>
    );
};

export default EF_Dates;
