// EF_Depth.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import NumericInput from '@/components/widgets/input/numeric';

const GeoPosition3D = ({ parent }: { parent: string }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const valorInicial = "";

    const easting = values?.[parent]?.easting || valorInicial;
    const northing = values?.[parent]?.northing || valorInicial;
    const elevation = values?.[parent]?.elevation || valorInicial;

    useEffect(() => {
        setFieldValue(`easting`, valorInicial);
        if (!easting) setFieldValue(`${parent}.easting`, valorInicial);
        if (!northing) setFieldValue(`${parent}.northing`, valorInicial);
        if (!elevation) setFieldValue(`${parent}.elevation`, valorInicial);
    }, [easting, northing, elevation, setFieldValue, parent]);

    return (
        <View style={[GlobalStyles.row, {marginRight: 10}]}>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Coordenada Leste:" : "Easting:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.[parent]?.easting || ''}
                    onChange={(text) => setFieldValue(`${parent}.easting`, text)}
                />
                {easting === '' && (
                    <Text style={GlobalStyles.errorText}>
                        {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                    </Text>
                )}
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Coordenada Norte:" : "Northing:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.[parent]?.northing || ''}
                    onChange={(text) => setFieldValue(`${parent}.northing`, text)}
                />
                {northing === '' && (
                    <Text style={GlobalStyles.errorText}>
                        {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                    </Text>
                )}                
            </View>
            <View style={GlobalStyles.col4}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Elevação:" : "Elevation:"}</Text>
                <NumericInput
                    step={0.00001}
                    value={values?.[parent]?.elevation || ''}
                    onChange={(text) => setFieldValue(`${parent}.elevation`, text)}
                />
                {elevation === '' && (
                    <Text style={GlobalStyles.errorText}>
                        {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                    </Text>
                )}                
            </View>
        </View>
    );
};

export default GeoPosition3D;
