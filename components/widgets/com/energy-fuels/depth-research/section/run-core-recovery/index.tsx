import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_RunCoreRecovery = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = 100;

    const currentValue = values?.[parent]?.recovery?.[index];

    useEffect(() => {
        if (currentValue === undefined) {
            setFieldValue(`${parent}.recovery[${index}]`, valorInicial);
        }
    }, [currentValue, index, parent, setFieldValue]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>
                {language === 'pt-BR' ? 'Recuperação' : 'Recovery'}:
            </Text>
            <View>
                <NumericInput
                    step={0.01}
                    value={currentValue ?? 0} // garante valor definido
                    onChange={(text) =>
                        setFieldValue(`${parent}.recovery[${index}]`, text)
                    }
                />
            </View>
        </View>
    );
};

export default EF_RunCoreRecovery;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
