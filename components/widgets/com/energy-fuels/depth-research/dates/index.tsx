import { View, Text, TextInput } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

const EF_Dates = ({ parent }: { parent: string }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const valorInicial = '';

    useEffect(() => {
        if (!values?.[parent]?.start) {
            setFieldValue(`${parent}.start`, valorInicial);
        }
    }, [values?.[parent]?.start, setFieldValue, valorInicial]);

    useEffect(() => {
        if (!values?.[parent]?.end) {
            setFieldValue(`${parent}.end`, valorInicial);
        }
    }, [values?.[parent]?.end, setFieldValue, valorInicial]);  

    return (
        <View style={GlobalStyles.row}>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Início:" : "Start Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values?.[parent]?.start || valorInicial}
                    onChangeText={(text) => setFieldValue(`${parent}.start`, text)}
                />
            </View>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Término:" : "End Date:"}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values?.[parent]?.end || valorInicial}
                    onChangeText={(text) => setFieldValue(`${parent}.end`, text)}
                />
            </View>
        </View>
    );
};

export default EF_Dates;
