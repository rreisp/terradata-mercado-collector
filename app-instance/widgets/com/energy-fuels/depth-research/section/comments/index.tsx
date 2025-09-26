import { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Notas = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();
    const valorInicial = '';

    const fieldError = errors?.[parent]?.comments?.[index];

    useEffect(() => {
        if (!values?.[parent]?.comments?.[index]) {
            setFieldValue(`${parent}.comments[${index}]`, valorInicial);
        }
    }, [index, values?.[parent]?.comments?.[index], setFieldValue, valorInicial]);

    return (
        <View>
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
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    textarea: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5 },
});

export default EF_Notas;
