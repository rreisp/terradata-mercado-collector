// components/widgets/input/ConditionalNumericInput.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import NumericInput from '@/components/widgets/input/numeric';
import GlobalStyles from '@/constants/styles';

interface Props {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    checked: boolean;
    onCheckChange: (checked: boolean) => void;
    disabledWhenUnchecked?: boolean;
    step: number;
    min: number;
    max: number;
    defaultValue: number | string;
}

const ConditionalNumericInput: React.FC<Props> = ({
    label,
    value,
    onChange,
    checked,
    onCheckChange,
    disabledWhenUnchecked = true,
    step = 1,
    min = undefined,
    max = undefined,
    defaultValue
}) => {
    const [val, setVal] = useState(value);

    const handleCheckChange = (checked: boolean) => {
        if (checked) {
            setVal(defaultValue);
        } else {
            setVal("");
        }
        onCheckChange(checked);
    };

    const handleChange = (v: string) => {
        setVal(v);
        onChange(v);
    };

    return (
        <View style={[styles.container]}>
            <Text style={GlobalStyles.label}>{label}</Text>
            <View style={[GlobalStyles.row]}>
                <View style={[GlobalStyles.col1, styles.checkbox]}>
                    <Checkbox
                        value={checked}
                        onValueChange={handleCheckChange}
                        color={checked ? '#4630EB' : undefined}
                        style={styles.checkbox}
                    />
                </View>
                <View style={[GlobalStyles.col11, {paddingRight: 8}]}>
                    <NumericInput
                        value={val}
                        onChange={handleChange}
                        disabled={disabledWhenUnchecked && !checked}
                        min={min}
                        max={max}
                        step={step}
                    />
                </View>
            </View>
        </View>
    );
};

export default ConditionalNumericInput;

const styles = StyleSheet.create({
    container: { marginTop: 5 },
    checkbox: {
        flexDirection: 'row',
        marginRight: 5,
        paddingTop: 1,
    },
});
