import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_LithicFragments = ({ index, parent }) => {
  const { language } = useLanguage();
  const { values, setFieldValue } = useFormikContext();

  const fieldPath = `${parent}.lithicFragmentsPct[${index}]`;
  const valorPadrao = "";
  const sugestaoInicial = "0.5"; // já com ponto

  // Função para normalizar decimal
  const normalizeValue = (val?: string) => {
    if (!val) return valorPadrao;
    return val.replace(",", ".");
  };

  const initialValue = normalizeValue(values?.[parent]?.lithicFragmentsPct?.[index]);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

  // Sincroniza valor inicial no Formik
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
      label={language === 'pt-BR' ? 'Fragmentos Líticos:' : 'Lithic Fragments:'}
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

export default EF_LithicFragments;
