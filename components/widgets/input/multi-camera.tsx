import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useField, useFormikContext } from 'formik';
import { MaterialIcons } from '@expo/vector-icons'; // Para o ícone de remoção
import { ImageRecord } from '@/types/image-record';

type MultiCameraInputProps = {
    name: string;
    quality?: number;
    maxPhotos?: number;
    handleDelete: (id: number) => void;
};

export const MultiCameraInput: React.FC<MultiCameraInputProps> = ({ name, maxPhotos, quality, handleDelete }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField<ImageRecord[]>(name);

    // Certifica-se de que o valor inicial do campo seja um array
    React.useEffect(() => {
        if (!Array.isArray(field.value)) {
            setFieldValue(name, []);
        }
    }, [field.value, name, setFieldValue]);


    const handleLaunchCamera = async () => {
        if (maxPhotos && field?.value?.length >= maxPhotos) {
            Alert.alert('Limite de Fotos', `Você atingiu o limite de ${maxPhotos} fotos.`);
            return;
        }

        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão Necessária', 'Precisamos da permissão da câmera para tirar fotos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: quality,
            base64: true,
            allowsMultipleSelection: false,
        });

        if (result.canceled) return;

        const photo = result.assets?.[0];
        if (photo?.base64) {
            const newPhotoUri = `data:image/jpeg;base64,${photo.base64}`;
            // 🔑 Garantir que seja salvo no formato { id, img }
            const newRecord: ImageRecord = {
                // id: Date.now().toString(),
                img: newPhotoUri,
            };

            setFieldValue(name, [...field.value, newRecord]);
        }
    };

    const handleRemovePhoto = (indexToRemove: number) => {
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
                        const updatedPhotos = field.value.filter((_, index) => index !== indexToRemove);
                        setFieldValue(name, updatedPhotos);
                        if (field.value[indexToRemove].id)
                            handleDelete(field.value[indexToRemove].id);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Button
                title={field?.value?.length > 0 ? "Adicionar Mais Fotos" : "Tirar Foto"}
                onPress={handleLaunchCamera}
                disabled={maxPhotos && field?.value?.length >= maxPhotos} // Desabilita o botão se o limite for atingido
            />

            {field?.value?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
                    {field.value.map((photoUri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image id={`${photoUri.id}`} source={{ uri: photoUri.img }} style={styles.preview} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemovePhoto(index)}
                            >
                                <MaterialIcons name="cancel" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {meta.touched && meta.error && (
                <Text style={styles.errorText}>{meta.error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    previewContainer: {
        flexDirection: 'row',
        marginTop: 3,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden', // Para garantir que o borderRadius funcione
    },
    preview: {
        width: 100,
        height: 100,
        borderRadius: 9
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