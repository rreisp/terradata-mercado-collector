import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useFormikContext } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5

import EF_Clay from './clay';
import EF_Color from './color';
import EF_Notas from './comment';
import EF_Depth from './depth';
import EF_Grainsize from './grainsize';
import EF_Hardness from './hardness';
import EF_HMS from './hms';
import EF_Induration from './induration';
import EF_LithicFragments from './lithic-fragments';
import EF_Micah from './micah';
import EF_Moisture from './moisture';
import EF_OrganicMatter from './organic-matter';
import EF_Roundness from './roundness';
import EF_RunCoreRecovery from './run-core-recovery';
import EF_Shells from './shells';
import EF_Sorting from './sorting';
import EF_Volume from './volume';
import EF_Wash from './wash';
import EF_Litologia from './litologia';
import { useLanguage } from '@/contexts/LanguageContext';

const Section = ({ el, index, size, parent }) => {
    const { language } = useLanguage();
    const [collapsed, setCollapsed] = useState(true);
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        setFieldValue(`${parent}.depth[${index}].from`, (index == 0 ? 0 : values?.[parent]?.depth?.[index - 1].to));
        setFieldValue(`${parent}.depth[${index}].to`, (index == 0 ? 100 : Number(values?.[parent]?.depth?.[index - 1].to) + 100));
    }, []);


    // setFieldValue(`${index}.depth[${index}].to`, (index == 0 ? 100 : values?.[parent]?.depth?.[index - 1].to) + 100));

    return (
        <View style={styles.bordered}>
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={(index % 2 == 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd)}>
                <View style={GlobalStyles.col3}>
                    <Text style={GlobalStyles.label}>{language === 'pt-BR' ? `INTERVALO ${index + 1}` : `INTERVAL ${index + 1}`}</Text>
                </View>
                <View style={GlobalStyles.col8}>
                    <Text>{language === 'pt-BR' ? `de` : `from`} {index == 0 ? 0 : values?.[parent]?.depth?.[index]?.from}cm {language === 'pt-BR' ? `até` : `to`} {values?.[parent]?.depth?.[index]?.to || ''}cm</Text>
                </View>
                <View style={GlobalStyles.col1, styles.right}>
                    <Icon
                        name={collapsed ? 'chevron-down' : 'chevron-up'}
                        size={16}
                        color="#333"
                    />
                </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                <View key={el.id} style={styles.sectionContent}>
                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Depth
                                index={index}
                                editable={index === size - 1}
                                parent={parent}
                            // value={depths[index]}
                            // onChange={(val) => {
                            //     const novos = [...depths];
                            //     novos[index] = val;
                            //     setDepths(novos);
                            // }}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_RunCoreRecovery
                                index={index}
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                                parent={parent}
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
                        parent={parent}
                    // value={lithologies[index]}
                    // onChange={(val) => {
                    //     const novos = [...lithologies];
                    //     novos[index] = val;
                    //     setlithologies(novos);
                    // }}
                    />
                    <View style={GlobalStyles.row}>
                        <View style={GlobalStyles.col}>
                            <EF_Notas
                                index={index}
                                parent={parent}
                            // value={estruturaNotas[index]}
                            // onChange={(val) => {
                            //     const novos = [...estruturaNotas];
                            //     novos[index] = val;
                            //     setEstruturaNotas(novos);
                            // }}
                            />
                        </View>
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
    sectionHeaderEven: {
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#cbf4f1',
        padding: 12,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    sectionHeaderOdd: {
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#b0efff',
        padding: 12,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    sectionContent: {
        padding: 3,
        backgroundColor: '#fefefe',
    },
    right: {
        alignContent: "flex-end"
    }
});
