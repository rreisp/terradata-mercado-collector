import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '@/components/widgets/input/numeric';

const EF_HMS = ({ index, parent }) => {
    const { values, setFieldValue } = useFormikContext();
    const valorInicial = 0;
    const [val, setVal] = useState(values?.[parent]?.hms?.[index] || valorInicial);

    const handleChange = (text: number) => {
        setFieldValue(`${parent}.hms[${index}]`, text);
        setVal(text);
    };

    useEffect(() => {
        setFieldValue(`${parent}.hms[${index}]`, val);
    }, [index, values?.[parent]?.hms, setFieldValue]);

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.label}>%HMS:</Text>
            <View>
                <NumericInput
                    step={0.01}
                    min={0}
                    max={100}
                    value={val}
                    onChange={handleChange} />
            </View>
        </View>
    );
};

export default EF_HMS;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
});