// EF_Depth.js
import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import NumericInput from '@/components/widgets/input/numeric';

const EF_Coordinates = ( ) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const valorInicial = "";

    useEffect(() => {
        if (!values?.easting) {
            setFieldValue(`easting`, valorInicial);
        }
    }, [values?.easting, setFieldValue, valorInicial]);

    useEffect(() => {
        if (!values?.northing) {
            setFieldValue(`northing`, valorInicial);
        }
    }, [values?.northing, setFieldValue, valorInicial]);    

    useEffect(() => {
        if (!values?.elevation) {
            setFieldValue(`elevation`, valorInicial);
        }
    }, [values?.elevation, setFieldValue, valorInicial]);   

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Coordenada Leste:" : "Easting:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.easting || ''}
                    onChange={(text) => setFieldValue(`easting`, text)}
                />
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Coordenada Norte:" : "Northing:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.northing || ''}
                    onChange={(text) => setFieldValue(`northing`, text)}
                />
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Elevação:" : "Elevation:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.elevation || ''}
                    onChange={(text) => setFieldValue(`elevation`, text)}
                />
            </View>
        </View>
    );
};

export default EF_Coordinates;
