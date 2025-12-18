import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '@/core/constants/styles';
import NumericInput from '@/core/components/widgets/numeric';

import * as Yup from 'yup';
import { EnergyFuelsDrillingValidator } from '@/app-instance/scripts/validate';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_HMS = ({ index, parent }) => {
    const { language } = useLanguage();    
    const { values, errors, setFieldValue, setFieldTouched, validateForm} = useFormikContext<any>();

    // instancia o validator e pega as regras de hms
    const validatorInstance = new EnergyFuelsDrillingValidator(language);
    const fieldSchema = validatorInstance.ef_depth_research({ type: 'ef_depth_research' }, 'pt-BR');
    const hmsSchema: Yup.NumberSchema = fieldSchema.fields['hms'].innerType;

    const fieldPath = `${parent}.hms[${index}]`;
    const fieldError = errors?.[parent]?.hms?.[index];

    const valorInicial = 0;
    const initialVal = values?.[parent]?.hms?.[index] ?? valorInicial;
    const [val, setVal] = useState(initialVal);

    const handleChange = (num: number) => {
        setFieldValue(fieldPath, num);
        setVal(num);
    };

    useEffect(() => {
        setFieldValue(fieldPath, val);
        // marca o campo como "tocado" logo na inicialização
        setFieldTouched(fieldPath, true, false);
        validateForm(values);
    }, []);

    useEffect(() => {
        setFieldValue(fieldPath, val);
        // marca o campo como "tocado" logo na inicialização
        setFieldTouched(fieldPath, true, false);
    }, [index, values?.[parent]?.hms, setFieldValue, setFieldTouched]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>HMS (%):</Text>
            <View>
                <NumericInput
                    step={0.01}
                    min={0}
                    max={100}
                    value={val}
                    onChange={handleChange}
                    error={fieldError}
                />
                {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
            </View>
        </View>
    );
};

export default EF_HMS;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});
