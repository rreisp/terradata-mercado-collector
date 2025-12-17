import React from 'react';
import {
    View,
    Text,
    Button,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { useField, useFormikContext } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';

type CameraInputProps = {
    name: string;
    language: string;

    /** Configurações opcionais */
    maxWidth?: number;
    compress?: number;
};

export const CameraInput: React.FC<CameraInputProps> = ({
    name,
    language,
    maxWidth = 1024,
    compress = 0.6,
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<string>(name);
    const isPT = language === 'ptBR';

    /** Redimensiona e comprime a imagem */
    const manipulateImage = async (uri: string) => {
        return ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: maxWidth } }],
            {
                compress,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true,
            }
        );
    };

    const handleLaunchCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                isPT ? 'Permissão Necessária' : 'Permission Required',
                isPT
                    ? 'Precisamos da permissão da câmera para tirar fotos.'
                    : 'We need camera permission to take photos.'
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (result.canceled) return;

        const photo = result.assets?.[0];
        if (!photo?.uri) return;

        try {
            const manipulated = await manipulateImage(photo.uri);
            if (!manipulated.base64) return;

            setFieldValue(
                name,
                `data:image/jpeg;base64,${manipulated.base64}`
            );
        } catch (error) {
            Alert.alert(
                isPT ? 'Erro' : 'Error',
                isPT
                    ? 'Erro ao processar a imagem.'
                    : 'Error while processing the image.'
            );
        }
    };

    const handleRemovePhoto = () => {
        Alert.alert(
            isPT ? 'Remover Foto' : 'Remove photo',
            isPT
                ? 'Tem certeza que deseja remover esta foto?'
                : 'Are you sure you want to remove this photo?',
            [
                { text: isPT ? 'Cancelar' : 'Cancel', style: 'cancel' },
                {
                    text: isPT ? 'Remover' : 'Remove',
                    style: 'destructive',
                    onPress: () => setFieldValue(name, ''),
                },
            ]
        );
    };

    const photoExists =
        typeof field.value === 'string' && field.value.trim() !== '';

    return (
        <View>
            {!photoExists ? (
                <Button
                    title={isPT ? 'Tirar Foto' : 'Take photo'}
                    onPress={handleLaunchCamera}
                />
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
        alignSelf: 'flex-start',
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
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});
