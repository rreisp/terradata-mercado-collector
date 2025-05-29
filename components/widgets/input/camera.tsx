// components/CameraInput.tsx
import React from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useField, useFormikContext } from 'formik';

type CameraInputProps = {
    name: string;
};

export const CameraInput: React.FC<CameraInputProps> = ({ name }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleLaunchCamera = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.8,
            includeBase64: true,
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert('Erro ao abrir a câmera', result.errorMessage || 'Erro desconhecido');
            return;
        }

        const photo = result.assets?.[0];
        if (photo?.base64) {
            setFieldValue(name, `data:${photo.type};base64,${photo.base64}`);
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
