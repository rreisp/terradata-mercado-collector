import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import GlobalStyles from '../../../constants/styles';

const NumericInput = ({
    value,
    onChange,
    placeholder = 'Digite um número',
    disabled = false,
    style = {},
    ...props
}) => {
    const handleChange = (text) => {
        const formatted = text.replace(',', '.');
        const valid = /^-?\d*(\.\d*)?$/.test(formatted);

        if (valid || formatted === '' || formatted === '-') {
            onChange(formatted);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                value={value?.toString()}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                placeholder={placeholder}
                editable={!disabled}
                style={[
                    GlobalStyles.input,
                    disabled && styles.inputDisabled
                ]}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputDisabled: {
        backgroundColor: '#eee',
        color: '#888',
    },
});

export default NumericInput;
