import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Section from './section';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import GlobalStyles from '../../../../../constants/styles';

const EF_DepthResearch = ({ onChange }) => {
    const [elements, setElements] = useState<{ id: number }[]>([]);

    const handleAddElement = () => {
        const id = Date.now();
        setElements(prev => [...prev, { id }]);
    };

    const handleRemoveElement = (id: number) => {
        const confirmAndRemove = () => {
            const index = elements.findIndex(el => el.id === id);
            if (index !== -1) {
                setElements(prev => prev.filter((_, i) => i !== index));
            }
        };
        const msg = "Tem certeza que deseja remover o intervalo?";
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(msg);
            if (confirmed) confirmAndRemove();
        } else {
            Alert.alert(
                'Confirmação',
                msg,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Remover', style: 'destructive', onPress: confirmAndRemove }
                ],
                { cancelable: true }
            );
        }
    };

    return (
        <View>
            {elements.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum intervalo adicionado.</Text>
            ) : (
                elements.map((el, index) => (
                    <View key={el.id}>
                        <Section index={index} el={el} size={elements.length}/>
                        <View>
                            <TouchableOpacity style={[(index == elements.length - 1 ? GlobalStyles.warnButton : GlobalStyles.disabledButton)]} onPress={() => handleRemoveElement(el.id)} disabled={index !== elements.length - 1}>
                                <View style={GlobalStyles.row}>
                                    <Icon name="trash" size={16} color="#fff" style={styles.icon} />
                                    <Text style={styles.buttonText}>REMOVER INTERVALO {index + 1}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
            <View>
                <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleAddElement}>
                    <View style={GlobalStyles.row}>
                        <Icon name="plus" size={16} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonText}>ADICIONAR INTERVALO</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginHorizontal: 16
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        alignItems: 'center'
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_DepthResearch;
