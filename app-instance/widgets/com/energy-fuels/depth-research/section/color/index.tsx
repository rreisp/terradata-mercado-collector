import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Color = ({ index, parent, options }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    useEffect(() => {
        if (!values?.[parent]?.color || !values?.[parent]?.color[index]) {
            setFieldValue(`${parent}.color[${index}]`, 0);
        }
    }, []);

    const fieldError = errors?.[parent]?.color?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Cor` : `Color`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={values?.[parent]?.color?.[index] || options[0].id}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.color[${index}]`, itemValue)}
                    style={GlobalStyles.picker}
                >
                    {options && options.map((val, idx) => (
                        <Picker.Item key={idx} label={val.description} value={val.id} />
                    ))}
                </Picker>
            </View>
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};

export default EF_Color;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
