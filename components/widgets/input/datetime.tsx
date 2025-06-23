import React, { useState } from 'react';
import { View, TextInput, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaskInput, { Masks } from 'react-native-mask-input';

type DateTimeProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  format?: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  placeholder?: string;
};

const formatDate = (date: Date, format: string) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString());
};

const DateTime: React.FC<DateTimeProps> = ({
  value,
  onChange,
  format = 'dd/MM/yyyy',
  placeholder = 'Selecione uma data',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShowPicker(true)}>
        <MaskInput
          editable={false}
          value={value ? formatDate(value, format) : ''}
          style={styles.input}
          mask={format === 'dd/MM/yyyy' ? Masks.DATE_DDMMYYYY :
                format === 'MM/dd/yyyy' ? Masks.DATE_MMDDYYYY :
                Masks.DATE_YYYYMMDD}
          placeholder={placeholder}
        />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default DateTime;
