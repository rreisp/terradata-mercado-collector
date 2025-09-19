import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import NumericInput from '@/core/components/widgets/numeric';

const EF_Volume = ({ index, parent }) => {
    const { values, setFieldValue, errors } = useFormikContext();
    const valorInicial = 0;

    const currentValue = values?.[parent]?.volume?.[index];
    const fieldError = errors?.[parent]?.volume?.[index];

    useEffect(() => {
        if (currentValue === undefined || currentValue === null) {
            setFieldValue(`${parent}.volume[${index}]`, valorInicial);
        }
    }, [currentValue, index, parent, setFieldValue]);

    const handleChange = (text: string) => {
        // NumericInput já lida com a validação e formatação.
        // Apenas repassa o valor para o Formik.
        setFieldValue(`${parent}.volume[${index}]`, text);
    };

    return (
        <View>
            <View style={styles.container}>
                <Text style={GlobalStyles.label}>Volume (cm³):</Text>
                <View>
                    <NumericInput
                        step={0.01}
                        value={currentValue}
                        onChange={handleChange}
                    />
                </View>
            </View>
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};

export default EF_Volume;

const styles = StyleSheet.create({
    container: { marginTop: 5 }
});