import { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import NumericInput from '@/core/components/widgets/numeric';

const EF_Depth = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    const previousTo = values?.[parent]?.depth?.[index - 1]?.to ?? 0;
    const currentFrom = values?.[parent]?.depth?.[index]?.from;
    const currentTo = values?.[parent]?.depth?.[index]?.to;

    const fieldError = errors?.[parent]?.depth?.[index]?.to;

    // Set valorInicialFrom uma vez
    useEffect(() => {
        if (currentFrom === undefined) {
            setFieldValue(`${parent}.depth[${index}].from`, String(previousTo));
        }
    }, []);

    useEffect(() => {
        if (currentTo === undefined) {
            setFieldValue(`${parent}.depth[${index}].to`, String(Number(previousTo) + 100));
        }
    }, []);

    const handleChangeFrom = (text: string) => {
        setFieldValue(`${parent}.depth[${index}].from`, text);
    };

    const handleChangeTo = (text: string) => {
        setFieldValue(`${parent}.depth[${index}].to`, text);
        const size = values?.[parent]?.lithologies[index].length || 0;
        if (size > 0) {
            setFieldValue(`${parent}.lithologies[${index}][${size - 1}].to`, text);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>
                {language === 'pt-BR' ? 'Profundidade' : 'Depth'} (cm):
            </Text>
            <View style={[GlobalStyles.row, { marginRight: 5 }]}>
                <View style={[GlobalStyles.col6]}>
                    <NumericInput
                        step={1}
                        value={String(currentFrom ?? '')}
                        placeholder={language === 'pt-BR' ? 'De' : 'From'}                        
                        min={0}
                        onChange={(value) =>
                            handleChangeFrom(value)
                        }
                    />
                </View>
                <View style={GlobalStyles.col6}>
                    <NumericInput
                        step={1}
                        value={String(currentTo ?? '')}
                        placeholder={language === 'pt-BR' ? 'Até' : 'To'}                        
                        min={0}
                        onChange={(value) =>
                            handleChangeTo(value)
                        }
                    />
                </View>
            </View>
            <View style={[GlobalStyles.row, { marginRight: 5 }]}>
                <View style={[GlobalStyles.col6]}></View>
                <View style={[GlobalStyles.col6]}>{fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}</View>
            </View>
        </View>
    );
};

export default EF_Depth;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
