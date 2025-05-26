import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Depth = ({ index, editable, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const previousTo = values?.[parent]?.depth?.[index - 1]?.to ?? 0;
    const currentFrom = values?.[parent]?.depth?.[index]?.from;
    const currentTo = values?.[parent]?.depth?.[index]?.to;

    // Set valorInicialFrom uma vez
    useEffect(() => {
        if (currentFrom === undefined) {
            setFieldValue(`${parent}.depth[${index}].from`, String(previousTo));
        }
    }, [currentFrom, previousTo, index, parent, setFieldValue]);

    useEffect(() => {
        if (currentTo === undefined) {
            setFieldValue(`${parent}.depth[${index}].to`, String(Number(previousTo) + 100));
        }
    }, [currentTo, previousTo, index, parent, setFieldValue]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>
                {language === 'pt-BR' ? 'Profundidade' : 'Depth'} (cm):
            </Text>
            <View style={GlobalStyles.row}>
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...GlobalStyles.disabledInput
                    }}
                    placeholder={language === 'pt-BR' ? 'De' : 'From'}
                    keyboardType="numeric"
                    value={String(currentFrom ?? '')}
                    onChangeText={(text) => setFieldValue(`${parent}.depth[${index}].from`, text)}
                    editable={false}
                />
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...(editable ? {} : GlobalStyles.disabledInput)
                    }}
                    placeholder={language === 'pt-BR' ? 'Até' : 'To'}
                    keyboardType="numeric"
                    value={String(currentTo ?? '')}
                    onChangeText={(text) => setFieldValue(`${parent}.depth[${index}].to`, text)}
                    editable={editable}
                />
            </View>
        </View>
    );
};

export default EF_Depth;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
