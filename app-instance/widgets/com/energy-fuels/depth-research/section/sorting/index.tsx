import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Sorting = ({ index, parent, options }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    useEffect(() => {
        if (!values?.[parent]?.sorting || !values?.[parent]?.sorting[index]) {
            setFieldValue(`${parent}.sorting[${index}]`, 0);
        }
    }, []);

    const fieldError = errors?.[parent]?.sorting?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `Seletividade Granulométrica` : `Sorting`}:</Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={values?.[parent]?.sorting?.[index] || options[0].id}
                    onValueChange={(itemValue) => setFieldValue(`${parent}.sorting[${index}]`, itemValue)}
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

export default EF_Sorting;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});
