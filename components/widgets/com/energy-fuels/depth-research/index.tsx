import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ScrollView, Text } from 'react-native';
import EF_Depth from './depth';
import EF_HMS from './hms';
import EF_RunCoreRecovery from './run-core-recovery';
import EF_Litogia from './litologia';
import EF_EstruturaNotas from './estrutura-notas';

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
                    <View key={el.id} style={styles.addSectionBtn}>
                        <Text style={styles.title}>SEGMENTO {index + 1}:</Text>
                        <EF_Depth
                            index={index}
                            // value={depths[index]}
                            // onChange={(val) => {
                            //     const novos = [...depths];
                            //     novos[index] = val;
                            //     setDepths(novos);
                            // }}
                        />
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <EF_HMS
                                    index={index}
                                    // value={hms[index]}
                                    // onChange={(val) => {
                                    //     const novos = [...hms];
                                    //     novos[index] = val;
                                    //     setHms(novos);
                                    // }}
                                />
                            </View>
                            <View style={styles.col}>
                                <EF_RunCoreRecovery
                                    index={index}
                                    // value={runCoreRecovery[index]}
                                    // onChange={(val) => {
                                    //     const novos = [...runCoreRecovery];
                                    //     novos[index] = val;
                                    //     setRunCoreRecovery(novos);
                                    // }}
                                />
                            </View>
                        </View>
                        <EF_Litogia
                            index={index}
                            // value={litologias[index]}
                            // onChange={(val) => {
                            //     const novos = [...litologias];
                            //     novos[index] = val;
                            //     setLitologias(novos);
                            // }}
                        />
                        <EF_EstruturaNotas
                            index={index}
                            // value={estruturaNotas[index]}
                            // onChange={(val) => {
                            //     const novos = [...estruturaNotas];
                            //     novos[index] = val;
                            //     setEstruturaNotas(novos);
                            // }}
                        />
                        <Button
                            title={`Remover Segmento ${index + 1}`}
                            color="orange"
                            onPress={() => handleRemoveElement(el.id)}
                        />
                    </View>
                ))
            )}
            <View style={styles.addSectionBtn}>
                <Button title="Adicionar Segmento" onPress={handleAddElement} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1, marginHorizontal: 1 },
    title: {
        fontWeight: 'bold',
        color: 'navy',
        marginBottom: 3
    },
    addSectionBtn: {
        paddingTop: 10
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_DepthResearch;
