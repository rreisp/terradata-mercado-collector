import React from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useField, useFormikContext } from 'formik';

type CameraInputProps = {
    name: string;
};

export const CameraInput: React.FC<CameraInputProps> = ({ name }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleLaunchCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera para tirar fotos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
        });

        if (result.canceled) return;

        const photo = result.assets?.[0];
        if (photo?.base64) {
            setFieldValue(name, `data:image/jpeg;base64,${photo.base64}`);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Tirar Foto" onPress={handleLaunchCamera} />
            {typeof field.value === 'string' && field.value.trim() !== '' && (
                <Image source={{ uri: field.value }} style={styles.preview} />
            )}
            {meta.touched && meta.error && (
                <Text style={styles.errorText}>{meta.error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    preview: { width: 200, height: 200, marginTop: 10, borderRadius: 10 },
    errorText: { color: 'red', marginTop: 5 },
});
