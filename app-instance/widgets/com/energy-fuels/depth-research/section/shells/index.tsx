import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import { EnergyFuelsDrillingValidator } from '@/app-instance/scripts/validate';
import * as Yup from 'yup';

const EF_Shells = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    const fieldPath = `${parent}.shellsPct[${index}]`;
    const validatorInstance = new EnergyFuelsDrillingValidator();

    // Obtém o schema completo de ef_depth_research
    const fieldSchema = validatorInstance.ef_depth_research({ type: 'ef_depth_research' }, language);
    // Extrai a validação específica de shellsPct
    const shellsSchema: Yup.NumberSchema = fieldSchema.fields['shellsPct'].innerType;

    
    const valorPadrao = "0.00";           // agora padrão é "0"
    const sugestaoInicial = "0.50";     // já normalizado

    // Normaliza separador decimal
    const normalizeValue = (val?: string | number) => {
        if (val === undefined || val === null) return valorPadrao;
        return String(val).replace(",", ".");
    };

    const initialValue = normalizeValue(values?.[parent]?.shellsPct?.[index]);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

    const fieldError = errors?.[parent]?.shellsPct?.[index];

    // sincroniza inicial com formik
    useEffect(() => {
        setFieldValue(fieldPath, currentValue);
    }, []);

    const handleCheckChange = (checked: boolean) => {
        setIsChecked(checked);

        if (checked) {
            setFieldValue(fieldPath, sugestaoInicial);
            setCurrentValue(sugestaoInicial);
        } else {
            // valor lógico = "0", input exibido como ""
            setFieldValue(fieldPath, valorPadrao);
            setCurrentValue(valorPadrao);
        }
    };

    const handleValueChange = (val: string) => {
        const normalized = normalizeValue(val);
        setFieldValue(fieldPath, normalized);
        setCurrentValue(normalized);
    };

    return (
        <View>
            <ConditionalNumericInput
                label={language === 'pt-BR' ? 'Conchas (%):' : 'Shells (%):'}
                value={currentValue}
                defaultValue={sugestaoInicial}
                onChange={handleValueChange}
                checked={isChecked}
                onCheckChange={handleCheckChange}
                step={0.01}
                min={(shellsSchema as any)._exclusive?.min || 0}
                max={(shellsSchema as any)._exclusive?.max || 100}
            />
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};

export default EF_Shells;
