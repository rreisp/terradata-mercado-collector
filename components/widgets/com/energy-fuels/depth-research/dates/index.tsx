import { View, Text, TextInput } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import DateInput from '@/components/widgets/input/date';

const EF_Dates = ({ parent }: { parent: string }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
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
                <DateInput
                    value={values?.[parent]?.start || valorInicial}
                    onChange={(text) => setFieldValue(`${parent}.start`, text)}
                    format="dd/MM/yyyy"
                    placeholder="dd/mm/aaaa"
                />
            </View>
            <View style={GlobalStyles.col6}>
                <Text style={GlobalStyles.label}>{language === 'pt-BR' ? "Data de Término:" : "End Date:"}</Text>
                {/* <TextInput
                    style={GlobalStyles.input}
                    keyboardType="numeric"
                    value={values?.[parent]?.end || valorInicial}
                    onChangeText={(text) => setFieldValue(`${parent}.end`, text)}
                /> */}
                <DateInput
                    value={values?.[parent]?.end || valorInicial}
                    onChange={(text) => setFieldValue(`${parent}.end`, text)}
                    format="dd/MM/yyyy"
                    placeholder="dd/mm/aaaa"
                />
            </View>
        </View>
    );
};

export default EF_Dates;
