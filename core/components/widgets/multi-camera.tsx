import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { useField, useFormikContext } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageRecord } from '@/app-instance/types/image-record';
import GlobalStyles from '@/core/constants/styles';

type MultiCameraInputProps = {
    name: string;
    language: string;
    handleDelete: (id: number) => void;

    maxPhotos?: number;
    maxWidth?: number;
    compress?: number;
};

export const MultiCameraInput: React.FC<MultiCameraInputProps> = ({
    name,
    language,
    handleDelete,
    maxPhotos,
    maxWidth = 1024,
    compress = 0.6,
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<any>(name);

    const isPT = language === 'ptBR';

    /**
     * 🔐 NORMALIZAÇÃO DEFENSIVA
     * Garante que sempre trabalharemos com um array
     */
    const photos: ImageRecord[] = React.useMemo(() => {
        if (Array.isArray(field.value)) {
            return field.value;
        }

        if (field.value && typeof field.value === 'object' && 'img' in field.value) {
            return [field.value as ImageRecord];
        }

        return [];
    }, [field.value]);

    /**
     * 🔐 Garante inicialização no Formik
     * Evita undefined em renders futuros
     */
    React.useEffect(() => {
        if (!Array.isArray(field.value)) {
            setFieldValue(name, photos);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Redimensiona e comprime imagem */
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
        if (maxPhotos && photos.length >= maxPhotos) {
            Alert.alert(
                isPT ? 'Limite de Fotos' : 'Photos limit',
                isPT
                    ? `Você atingiu o limite de ${maxPhotos} fotos.`
                    : `You have reached the limit of ${maxPhotos} photos.`
            );
            return;
        }

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

        const asset = result.assets?.[0];
        if (!asset?.uri) return;

        try {
            const manipulated = await manipulateImage(asset.uri);
            if (!manipulated.base64) return;

            const updatedPhotos = [
                ...photos,
                { img: `data:image/jpeg;base64,${manipulated.base64}` },
            ];

            setFieldValue(name, updatedPhotos);
        } catch {
            Alert.alert(
                isPT ? 'Erro' : 'Error',
                isPT
                    ? 'Erro ao processar a imagem.'
                    : 'Error while processing the image.'
            );
        }
    };

    const handleRemovePhoto = (index: number) => {
        Alert.alert(
            isPT ? 'Remover Foto' : 'Remove photo',
            isPT
                ? 'Tem certeza que deseja remover essa foto?'
                : 'Are you sure you want to remove this photo?',
            [
                { text: isPT ? 'Cancelar' : 'Cancel', style: 'cancel' },
                {
                    text: isPT ? 'Remover' : 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        const removed = photos[index];
                        const updated = photos.filter((_, i) => i !== index);

                        setFieldValue(name, updated);

                        if (removed?.id) {
                            handleDelete(removed.id);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Button
                title={
                    photos.length > 0
                        ? isPT ? 'Adicionar mais fotos' : 'Add more photos'
                        : isPT ? 'Tirar foto' : 'Take photo'
                }
                onPress={handleLaunchCamera}
                disabled={!!maxPhotos && photos.length >= maxPhotos}
            />

            {photos.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.previewContainer}
                >
                    {photos.map((photo, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: photo.img }} style={styles.preview} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemovePhoto(index)}
                            >
                                <MaterialIcons name="cancel" size={22} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {meta.error && (
                <Text style={GlobalStyles.errorText}>{meta.error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    previewContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
    },
    preview: {
        width: 100,
        height: 100,
        borderRadius: 9,
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
        padding: 1,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});
