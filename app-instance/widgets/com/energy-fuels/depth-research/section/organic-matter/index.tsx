import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFormikContext } from 'formik';
import ConditionalNumericInput from '@/core/components/widgets/conditional-numeric';
import GlobalStyles from '@/core/constants/styles';
import { useLanguage } from '@/core/contexts/LanguageContext';
import { EnergyFuelsDrillingValidator } from '@/app-instance/scripts/validate';
import * as Yup from 'yup';

const EF_OrganicMatter = ({ index, parent }) => {
  const { language } = useLanguage();
  const { values, setFieldValue, errors } = useFormikContext();

  const fieldPath = `${parent}.organicMatterPct[${index}]`;
  const validatorInstance = new EnergyFuelsDrillingValidator(language);

  // Obtém o schema completo de ef_depth_research
  const fieldSchema = validatorInstance.ef_depth_research({ type: 'ef_depth_research' }, language);
  // Extrai a validação específica de organicMatterPct
  const organicMatterSchema: Yup.NumberSchema = fieldSchema.fields['organicMatterPct'].innerType;
  const valorPadrao = "0.00";            // padrão agora é "0"
  const sugestaoInicial = "0.50";      // já no formato correto

  // Função para normalizar separador decimal
  const normalizeValue = (val?: string | number) => {
    if (val === undefined || val === null) return valorPadrao;
    return String(val).replace(",", ".");
  };

  const initialValue = normalizeValue(values?.[parent]?.organicMatterPct?.[index]);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isChecked, setIsChecked] = useState(parseFloat(initialValue) > 0);

  const fieldError = errors?.[parent]?.organicMatterPct?.[index];

  // sincroniza valor inicial com Formik
  useEffect(() => {
    setFieldValue(fieldPath, currentValue);
  }, []);

  const handleCheckChange = (checked: boolean) => {
    setIsChecked(checked);

    if (checked) {
      setFieldValue(fieldPath, sugestaoInicial);
      setCurrentValue(sugestaoInicial);
    } else {
      // envia "0", input continua vazio
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
        label={language === 'pt-BR' ? 'Matéria Orgânica (%):' : 'Organic Matter (%):'}
        value={currentValue}
        defaultValue={sugestaoInicial}
        onChange={handleValueChange}
        checked={isChecked}
        onCheckChange={handleCheckChange}
        step={0.01}
        min={(organicMatterSchema as any)._exclusive?.min || 0}
        max={(organicMatterSchema as any)._exclusive?.max || 100}
      />
      {fieldError && <Text style={GlobalStyles.errorText}>{fieldError}</Text>}
    </View>
  );
};

export default EF_OrganicMatter;
