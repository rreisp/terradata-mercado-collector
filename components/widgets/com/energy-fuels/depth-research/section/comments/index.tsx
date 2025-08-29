import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Notas = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = '';

    useEffect(() => {
        if (!values?.[parent]?.comments?.[index]) {
            setFieldValue(`${parent}.comments[${index}]`, valorInicial);
        }
    }, []);    

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Comentários:` : `Comments:`}</Text>
            <TextInput
                style={styles.textarea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={values?.[parent]?.comments?.[index] || valorInicial}
                onChangeText={(text) => setFieldValue(`${parent}.comments[${index}]`, text)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    textarea: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5 },
});

export default EF_Notas;
