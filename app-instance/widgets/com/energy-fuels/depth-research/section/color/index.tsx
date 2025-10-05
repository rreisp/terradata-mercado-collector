import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Color = ({ index, parent, options }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    // Ordena options mantendo id = 0 no topo
    const sortedOptions = useMemo(() => {
        if (!options) return [];
        const [first, others] = [
            options.find(opt => opt.id === 0),
            options.filter(opt => opt.id !== 0).sort((a, b) =>
                a.description.localeCompare(b.description, language === 'pt-BR' ? 'pt' : 'en', { sensitivity: 'base' })
            )
        ];
        return first ? [first, ...others] : others;
    }, [options, language]);

    useEffect(() => {
        if (!values?.[parent]?.color || !values?.[parent]?.color[index]) {
            setFieldValue(`${parent}.color[${index}]`, 0);
        }
    }, []);

    const fieldError = errors?.[parent]?.color?.[index];

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>
                {language === 'pt-BR' ? `Cor` : `Color`}:
            </Text>
            <View style={[GlobalStyles.pickerContainer]}>
                <Picker
                    selectedValue={values?.[parent]?.color?.[index] || 0}
                    onValueChange={(itemValue) =>
                        setFieldValue(`${parent}.color[${index}]`, itemValue)
                    }
                    style={GlobalStyles.picker}
                >
                    {sortedOptions.map((val, idx) => (
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
