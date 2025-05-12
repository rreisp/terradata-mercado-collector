import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Collapsible from 'react-native-collapsible';
import GlobalStyles from '../../../../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5

import EF_Clay from '../clay';
import EF_Color from '../color';
import EF_Notas from '../comment';
import EF_Depth from '../depth';
import EF_Grainsize from '../grainsize';
import EF_Hardness from '../hardness';
import EF_HMS from '../hms';
import EF_Induration from '../induration';
import EF_LithicFragments from '../lithic-fragments';
import EF_Micah from '../micah';
import EF_Moisture from '../moisture';
import EF_OrganicMatter from '../organic-matter';
import EF_Roundness from '../roundness';
import EF_RunCoreRecovery from '../run-core-recovery';
import EF_Shells from '../shells';
import EF_Sorting from '../sorting';
import EF_Volume from '../volume';
import EF_Wash from '../wash';
import EF_Litologia from '../litologia';

const Section = ({ el, index }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <View style={styles.bordered}>
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={styles.sectionHeader}>
                <Text style={GlobalStyles.label}>SEGMENTO {index + 1}</Text>
                <Icon
                    name={collapsed ? 'chevron-down' : 'chevron-up'}
                    size={16}
                    color="#333"
                />
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                <View style={styles.sectionContent}>
                    <View key={el.id}>
                        <EF_Depth
                            index={index}
                        // value={depths[index]}
                        // onChange={(val) => {
                        //     const novos = [...depths];
                        //     novos[index] = val;
                        //     setDepths(novos);
                        // }}
                        />
                        <View style={GlobalStyles.row}>
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
                        <View style={GlobalStyles.row}>
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

                        <View style={GlobalStyles.row}>
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

                        <View style={GlobalStyles.row}>
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
                        <View style={GlobalStyles.row}>
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

                        <View style={GlobalStyles.row}>
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

                        <View style={GlobalStyles.row}>
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

                        <View style={GlobalStyles.row}>
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
                        <EF_Litologia
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

                    </View>
                </View>
            </Collapsible>
        </View>
    );
};
export default Section;

const styles = StyleSheet.create({
    bordered: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#eee'
    },
    sectionHeader: {
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee',
        padding: 12,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    sectionContent: {
        padding: 12,
        backgroundColor: '#fefefe',
    }
});
