import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Section from './section';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import GlobalStyles from '../../../../../constants/styles';

const EF_DepthResearch = ({ onChange }) => {
    const [elements, setElements] = useState<{ id: number }[]>([]);

    const [depths, setDepths] = useState<{ start: string; end: string }[]>([]);
    const [hms, setHms] = useState<string[]>([]);
    const [runCoreRecovery, setRunCoreRecovery] = useState<string[]>([]);
    const [litologias, setLitologias] = useState<{ de: string; ate: string; tipo: string }[][]>([]);
    const [estruturaNotas, setEstruturaNotas] = useState<string[]>([]);


    const handleAddElement = () => {
        const id = Date.now();
        setElements(prev => [...prev, { id }]);
        setDepths(prev => [...prev, { start: '', end: '' }]);
        setHms(prev => [...prev, '']);
        setRunCoreRecovery(prev => [...prev, '']);
        setLitologias(prev => [...prev, []]);
        setEstruturaNotas(prev => [...prev, '']);
    };

    const handleRemoveElement = (id: number) => {
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1) {
            setElements(prev => prev.filter((_, i) => i !== index));
            setDepths(prev => prev.filter((_, i) => i !== index));
            setHms(prev => prev.filter((_, i) => i !== index));
            setRunCoreRecovery(prev => prev.filter((_, i) => i !== index));
            setLitologias(prev => prev.filter((_, i) => i !== index));
            setEstruturaNotas(prev => prev.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        if (onChange) {
            onChange({
                depths,
                hms,
                runCoreRecovery,
                litologias,
                estruturaNotas
            });
        }
    }, [depths, hms, runCoreRecovery, litologias, estruturaNotas]);

    return (
        <View>
            {elements.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum segmento adicionado.</Text>
            ) : (
                elements.map((el, index) => (
                    <View key={el.id}>
                        <Section index={index} el={el}></Section>
                        <View>
                            <TouchableOpacity style={[(index == elements.length - 1 ? GlobalStyles.warnButton : GlobalStyles.disabledButton)]} onPress={() => handleRemoveElement(el.id)} disabled={index !== elements.length - 1}>
                                <View style={GlobalStyles.row}>
                                    <Icon name="trash" size={16} color="#fff" style={styles.icon} />
                                    <Text style={styles.buttonText}>REMOVER SEGMENTO {index + 1}</Text>
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
                        <Text style={styles.buttonText}>ADICIONAR SEGMENTO</Text>
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
