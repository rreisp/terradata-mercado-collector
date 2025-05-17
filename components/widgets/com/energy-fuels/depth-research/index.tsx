import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Section from './section';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import GlobalStyles from '../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_DepthResearch = ({ onChange }) => {
    const { language } = useLanguage();        
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
        const msg = (language === 'pt-BR' ? `Tem certeza que deseja remover o intervalo?` : `Are you sure you want to remove the range?`);
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(msg);
            if (confirmed) confirmAndRemove();
        } else {
            Alert.alert(
                (language === 'pt-BR' ? `Confirmação` : `Confirmation`),
                msg,
                [
                    { text: (language === 'pt-BR' ? `Cancelar` : `Confirmation`), style: 'cancel' },
                    { text: (language === 'pt-BR' ? `Remover` : `Delete`), style: 'destructive', onPress: confirmAndRemove }
                ],
                { cancelable: true }
            );
        }
    };

    return (
        <View>
            {elements.length === 0 ? (
                <Text style={styles.emptyText}>{language === 'pt-BR' ? `Nenhum intervalo adicionado.` : `No ranges added.`}</Text>
            ) : (
                elements.map((el, index) => (
                    <View key={el.id}>
                        <Section index={index} el={el} size={elements.length} />
                        <View>
                            {index == elements.length - 1 &&
                                <TouchableOpacity style={[(index == elements.length - 1 ? GlobalStyles.warnButton : GlobalStyles.disabledButton)]} onPress={() => handleRemoveElement(el.id)} disabled={index !== elements.length - 1}>
                                    <View style={GlobalStyles.row}>
                                        <Icon name="trash" size={16} color="#fff" style={styles.icon} />
                                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `REMOVER INTERVALO ${index + 1}` : `REMOVE INTERVAL ${index + 1}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                ))
            )}
            <View>
                <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleAddElement}>
                    <View style={GlobalStyles.row}>
                        <Icon name="plus" size={16} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `ADICIONAR INTERVALO` : `ADD INTERVAL`}</Text>
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
