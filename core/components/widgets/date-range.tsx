import { StyleSheet, View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import { useEffect } from 'react';
import DateInput from '@/core/components/widgets/date';

const DateRangeInput = ({ parent, error }: { parent: string, error: any }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext<any>();
    const valorInicial = '';

    const start = values?.[parent]?.start || valorInicial;
    const end = values?.[parent]?.end || valorInicial;

    useEffect(() => {
        if (!start) setFieldValue(`${parent}.start`, valorInicial);
        if (!end) setFieldValue(`${parent}.end`, valorInicial);
    }, [start, end, setFieldValue, parent]);

    return (
        <>
            <View style={[GlobalStyles.row]}>
                {/* Campo de Data Inicial */}
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
                    {error?.start && (
                        <Text style={styles.errorText}>{error.start}</Text>
                    )}
                </View>

                {/* Campo de Data Final */}
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
                    {error?.end && (
                        <Text style={styles.errorText}>{error.end}</Text>
                    )}
                </View>
            </View>

            {error && !error.start && !error.end && (
                <View style={GlobalStyles.row}>
                    <View style={GlobalStyles.col12}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                </View>
            )}
        </>
    );
};

export default DateRangeInput;

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginTop: 4,
    },
});
