import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ScrollView, Text } from 'react-native';
import EF_Depth from './depth';
import EF_HMS from './hms';
import EF_RunCoreRecovery from './run-core-recovery';
import EF_Litogia from './litologia';
import EF_Notas from './comment';
import EF_Hardness from './hardness';
import EF_Moisture from './moisture';
import EF_Wash from './wash';
import EF_Induration from './induration';
import EF_Grainsize from './grainsize';
import EF_Sorting from './sorting';
import EF_Roundness from './roundness';
import EF_Volume from './volume';
import EF_Color from './color';
import EF_Clay from './clay';
import EF_Micah from './micah';
import EF_Shells from './shells';
import EF_OrganicMatter from './organic-matter';
import EF_LithicFragments from './lithic-fragments';
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
                            <View style={GlobalStyles.col}>
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
                            <View style={GlobalStyles.col}>
                                <EF_Moisture
                                    index={index}
                                // value={volume[index]}
                                // onChange={(val) => {
                                //     const novos = [...volume];
                                //     novos[index] = val;
                                //     setVolume(novos);
                                // }}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Volume
                                    index={index}
                                // value={volume[index]}
                                // onChange={(val) => {
                                //     const novos = [...volume];
                                //     novos[index] = val;
                                //     setVolume(novos);
                                // }}
                                />
                            </View>
                            <View style={GlobalStyles.col}>
                                <EF_Hardness
                                    index={index}
                                // value={hardness[index]}
                                // onChange={(val) => {
                                //     const novos = [...hardness];
                                //     novos[index] = val;
                                //     setHardness(novos);
                                // }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Wash
                                    index={index}
                                // value={wash[index]}
                                // onChange={(val) => {
                                //     const novos = [...wash];
                                //     novos[index] = val;
                                //     setWash(novos);
                                // }}
                                />
                            </View>
                            <View style={GlobalStyles.col}>
                                <EF_Color
                                    index={index}
                                // value={wash[index]}
                                // onChange={(val) => {
                                //     const novos = [...wash];
                                //     novos[index] = val;
                                //     setWash(novos);
                                // }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Induration
                                    index={index}
                                // value={induration[index]}
                                // onChange={(val) => {
                                //     const novos = [...induration];
                                //     novos[index] = val;
                                //     setInduration(novos);
                                // }}
                                />
                            </View>
                            <View style={GlobalStyles.col}>
                                <EF_Grainsize
                                    index={index}
                                // value={grainsize[index]}
                                // onChange={(val) => {
                                //     const novos = [...grainsize];
                                //     novos[index] = val;
                                //     setGrainsize(novos);
                                // }}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Sorting
                                    index={index}
                                // value={sorting[index]}
                                // onChange={(val) => {
                                //     const novos = [...sorting];
                                //     novos[index] = val;
                                //     setSorting(novos);
                                // }}
                                />
                            </View>
                            <View style={GlobalStyles.col}>
                                <EF_Roundness
                                    index={index}
                                // value={roundness[index]}
                                // onChange={(val) => {
                                //     const novos = [...roundness];
                                //     novos[index] = val;
                                //     setRoundness(novos);
                                // }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Clay
                                    index={index}
                                // value={clay[index]}
                                // onChange={(val) => {
                                //     const novos = [...clay];
                                //     novos[index] = val;
                                //     setClay(novos);
                                // }}
                                />
                            </View>

                            <View style={GlobalStyles.col}>
                                <EF_Micah
                                    index={index}
                                // value={clay[index]}
                                // onChange={(val) => {
                                //     const novos = [...clay];
                                //     novos[index] = val;
                                //     setClay(novos);
                                // }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_Shells
                                    index={index}
                                // value={clay[index]}
                                // onChange={(val) => {
                                //     const novos = [...clay];
                                //     novos[index] = val;
                                //     setClay(novos);
                                // }}
                                />
                            </View>

                            <View style={GlobalStyles.col}>
                                <EF_OrganicMatter
                                    index={index}
                                // value={clay[index]}
                                // onChange={(val) => {
                                //     const novos = [...clay];
                                //     novos[index] = val;
                                //     setClay(novos);
                                // }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={GlobalStyles.col}>
                                <EF_LithicFragments
                                    index={index}
                                // value={clay[index]}
                                // onChange={(val) => {
                                //     const novos = [...clay];
                                //     novos[index] = val;
                                //     setClay(novos);
                                // }}
                                />
                            </View>
                            
                            <View style={GlobalStyles.col}>
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
                        <EF_Notas
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
