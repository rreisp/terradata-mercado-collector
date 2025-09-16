import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Micah = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const fieldPath = `${parent}.micahPct[${index}]`;
    const valorPadrao = "";
    const sugestaoInicial = "0.5"; // já no formato correto

    // Função para normalizar decimal
    const normalizeValue = (val?: string) => {
        if (!val) return valorPadrao;
        return val.replace(",", ".");
    };

    const initialValue = normalizeValue(values?.[parent]?.micahPct?.[index]);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

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
            setFieldValue(fieldPath, undefined);
            setCurrentValue(valorPadrao);
        }
    };

    const handleValueChange = (val: string) => {
        const normalized = normalizeValue(val);
        setFieldValue(fieldPath, normalized);
        setCurrentValue(normalized);
    };

    return (
        <ConditionalNumericInput
            label={language === 'pt-BR' ? 'Mica:' : 'Micah:'}
            value={currentValue}
            defaultValue={sugestaoInicial}
            onChange={handleValueChange}
            checked={isChecked}
            onCheckChange={handleCheckChange}
            step={0.01}
            min={0}
            max={100}
        />
    );
};

export default EF_Micah;
