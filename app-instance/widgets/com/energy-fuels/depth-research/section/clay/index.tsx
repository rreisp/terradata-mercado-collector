import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import { EnergyFuelsDrillingValidator } from '@/app-instance/scripts/validate';
import * as Yup from 'yup';

const EF_Clay = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue, errors } = useFormikContext();

    const fieldPath = `${parent}.clayPct[${index}]`;
    const validatorInstance = new EnergyFuelsDrillingValidator(language);

    // Obtém o schema completo de ef_depth_research
    const fieldSchema = validatorInstance.ef_depth_research({ type: 'ef_depth_research' }, language);
    // Extrai a validação específica de clayPct
    const claySchema: Yup.NumberSchema = fieldSchema.fields['clayPct'].innerType;

    const valorPadrao = "0.00";
    const sugestaoInicial = "0.50";

    const normalizeValue = (val?: string | number) => {
        if (val === undefined || val === null) return valorPadrao;
        return String(val).replace(",", ".");
    };

    const initialValue = normalizeValue(values?.[parent]?.clayPct?.[index]);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

    const fieldError = errors?.[parent]?.clayPct?.[index];

    useEffect(() => {
        setFieldValue(fieldPath, currentValue);
    }, []);

    const handleCheckChange = (checked: boolean) => {
        setIsChecked(checked);
        if (checked) {
            setFieldValue(fieldPath, sugestaoInicial);
            setCurrentValue(sugestaoInicial);
        } else {
            setFieldValue(fieldPath, valorPadrao);
            setCurrentValue(valorPadrao);
        }
    };

    const handleValueChange = (val: string) => {
        const normalized = normalizeValue(val);
        setFieldValue(fieldPath, normalized);
        setCurrentValue(normalized);
    };

    // // Pega mensagens de validação
    // const minMsg = getMessage('min', language == "pt-BR" ? 'Valor mínimo inválido' : 'Invalid minimum value');
    // const maxMsg = getMessage('max', language == "pt-BR" ? 'Valor máximo inválido' : 'Invalid maximum value');

    return (
        <View>
            <ConditionalNumericInput
                label={language === 'pt-BR' ? 'Argila/Silte (%):' : 'Clay/Silt (%):'}
                value={currentValue}
                defaultValue={sugestaoInicial}
                onChange={handleValueChange}
                checked={isChecked}
                onCheckChange={handleCheckChange}
                step={0.01}
                min={(claySchema as any)._exclusive?.min || 0}
                max={(claySchema as any)._exclusive?.max || 100}
            />
            {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
        </View>
    );
};

export default EF_Clay;