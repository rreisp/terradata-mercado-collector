import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';

const EF_LithicFragments = ({ index, parent }) => {
  const { language } = useLanguage();
  const { values, setFieldValue, errors } = useFormikContext();

  const fieldPath = `${parent}.lithicFragmentsPct[${index}]`;
  const valorPadrao = "0";           // agora padrão é "0"
  const sugestaoInicial = "0.5";     // já normalizado

  // Normaliza separador decimal
  const normalizeValue = (val?: string | number) => {
    if (val === undefined || val === null || val === "") return valorPadrao;
    return String(val).replace(",", ".");
  };

  const initialValue = normalizeValue(values?.[parent]?.lithicFragmentsPct?.[index]);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

  const fieldError = errors?.[parent]?.lithicFragmentsPct?.[index];

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
      {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
    </View>
  );
};

export default EF_LithicFragments;
