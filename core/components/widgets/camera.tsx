import React from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useField, useFormikContext } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';

type CameraInputProps = {
    name: string;
};

export const CameraInput: React.FC<CameraInputProps> = ({ name }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleLaunchCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão Necessária', 'Precisamos da permissão da câmera para tirar fotos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.2,
            base64: true,
        });

        if (result.canceled) return;

        const photo = result.assets?.[0];
        if (photo?.base64) {
            setFieldValue(name, `data:image/jpeg;base64,${photo.base64}`);
        }
    };

    const handleRemovePhoto = () => {
        Alert.alert(
            'Remover Foto',
            'Tem certeza que deseja remover esta foto?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    onPress: () => {
                        setFieldValue(name, ''); // Define o valor do campo como uma string vazia para "remover" a foto
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const photoExists = typeof field.value === 'string' && field.value.trim() !== '';

    return (
        <View>
            {!photoExists ? (
                <Button title="Tirar Foto" onPress={handleLaunchCamera} />
            ) : (
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: field.value }} style={styles.preview} />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={handleRemovePhoto}
                    >
                        <MaterialIcons name="cancel" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            )}

            {meta.touched && meta.error && (
                <Text style={styles.errorText}>{meta.error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imageWrapper: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'flex-start', // Centraliza o wrapper se o container for maior
    },
    preview: {
        width: 100,
        height: 100,
        borderRadius: 9,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
        padding: 1,
    },
    errorText: { color: 'red', marginTop: 5 },
});