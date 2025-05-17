// EF_Depth.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Depth = ({ index, editable }) => {
    const { language } = useLanguage();      
    const { values, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Profundidade` : `Depth`} (cm):</Text>
            <View style={GlobalStyles.row}>
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...(false ? {} : GlobalStyles.disabledInput)
                    }}
                    placeholder={language === 'pt-BR' ? `De` : `From`}
                    keyboardType="numeric"
                    value={values.depths?.[index]?.start}
                    onChangeText={(text) => setFieldValue(`depth[${index}].start`, text)}
                    editable={false}
                />
                <TextInput
                    style={{
                        ...GlobalStyles.input,
                        ...(editable ? {} : GlobalStyles.disabledInput)
                    }}
                    placeholder={language === 'Até' ? `De` : `To`}
                    keyboardType="numeric"
                    value={values.depths?.[index]?.end}
                    onChangeText={(text) => setFieldValue(`depth[${index}].end`, text)}
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