import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import DateInput from '@/components/widgets/input/date';

const DateRangeInput = ({ parent }: { parent: string }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext<any>();
    const valorInicial = '';

    const [datasInvalidas, setDatasInvalidas] = useState(false);

    const start = values?.[parent]?.start || valorInicial;
    const end = values?.[parent]?.end || valorInicial;

    // Preencher valores iniciais se vazios
    useEffect(() => {
        if (!start) setFieldValue(`${parent}.start`, valorInicial);
        if (!end) setFieldValue(`${parent}.end`, valorInicial);
    }, [start, end, setFieldValue, parent]);

    // Verificação se start < end
    useEffect(() => {
        if (start && end) {
            setDatasInvalidas(end < start);
        } else {
            setDatasInvalidas(false);
        }
    }, [start, end]);

    return (
        <>
            <View style={GlobalStyles.row}>
                <View style={GlobalStyles.col6}>
                    <Text style={GlobalStyles.label}>
                        {language === 'pt-BR' ? "Data de Início:" : "Start Date:"}
                    </Text>
                    <DateInput
                        value={start}
                        onChange={(text) => setFieldValue(`${parent}.start`, text)}
                        format="dd/MM/yyyy"
                        placeholder="dd/mm/aaaa"
                    />
                    {start === '' && (
                        <Text style={GlobalStyles.errorText}>
                            {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                        </Text>
                    )}
                </View>
                <View style={GlobalStyles.col6}>
                    <Text style={GlobalStyles.label}>
                        {language === 'pt-BR' ? "Data de Término:" : "End Date:"}
                    </Text>
                    <DateInput
                        value={end}
                        onChange={(text) => setFieldValue(`${parent}.end`, text)}
                        format="dd/MM/yyyy"
                        placeholder="dd/mm/aaaa"
                    />
                    {end === '' && (
                        <Text style={GlobalStyles.errorText}>
                            {language === 'pt-BR' ? "Campo obrigatório" : "Required field"}
                        </Text>
                    )}
                </View>
            </View>
            {datasInvalidas && (
                <View style={GlobalStyles.row}>
                    <View style={GlobalStyles.col12}>
                        <Text style={GlobalStyles.errorText}>
                            {language === 'pt-BR'
                                ? 'A data de início deve ser menor que a data de término.'
                                : 'Start date must be before end date.'}
                        </Text>
                    </View>
                </View>
            )}
        </>
    );
};

export default DateRangeInput;
