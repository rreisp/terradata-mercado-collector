import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_Clay = ({ index, parent }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();

    const fieldPath = `${parent}.clayPct[${index}]`;
    const valorPadrao = "";
    const sugestaoInicial = "0,5";

    const [currentValue, setCurrentValue] = useState(values?.[parent]?.clayPct?.[index] ?? valorPadrao);
    const [isChecked, setIsChecked] = useState(parseFloat(currentValue.replace(',', '.')) > 0);

    useEffect(() => {
        setFieldValue(fieldPath, currentValue);
        setCurrentValue(currentValue);
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
        setFieldValue(fieldPath, val);
        setCurrentValue(val);
    };

    return (
        <ConditionalNumericInput
            label={language === 'pt-BR' ? 'Argila:' : 'Clay:'}
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

export default EF_Clay;
