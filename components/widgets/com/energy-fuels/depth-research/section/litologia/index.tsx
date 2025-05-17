import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFormikContext, FieldArray } from 'formik';
import GlobalStyles from '../../../../../../../constants/styles';
import NumericInput from '../../../../../input/numeric';
import { useLanguage } from '@/contexts/LanguageContext';

const EF_Litologia = ({ index }) => {
    const { language } = useLanguage();        
    const { values, setFieldValue } = useFormikContext();

    // Garante que o array litologias[index] sempre exista
    useEffect(() => {
        if (!Array.isArray(values.litologias?.[index])) {
            const newLitologias = [...(values.litologias || [])];
            newLitologias[index] = [];
            setFieldValue('litologias', newLitologias);
        }
    }, [index, values.litologias, setFieldValue]);

    const litologiasGrupo = values.litologias?.[index] ?? [];

    return (
        <View style={styles.container}>
            <FieldArray name={`litologias[${index}]`}>
                {({ push, remove }) => (
                    <>
                        <View style={GlobalStyles.row}>
                            <View style={GlobalStyles.col11}>
                                <Text style={styles.label}>{language === 'pt-BR' ? `Litologia` : `Lithology`} {index + 1}:</Text>
                            </View>
                            <View style={GlobalStyles.col1}>
                                <Button title="+" onPress={() => push({ de: '', ate: '', tipo: '' })} />
                            </View>
                        </View>
                        {litologiasGrupo.length === 0 ? (
                            <Text style={styles.emptyText}>{language === 'pt-BR' ? `Nenhum item adicionado` : `No item found`}.</Text>
                        ) : (
                            litologiasGrupo.map((_, subIndex) => (
                                <View key={subIndex} style={GlobalStyles.row}>
                                    {/* <TextInput
                                        style={[GlobalStyles.col2, styles.input]}
                                        placeholder="De"
                                        keyboardType="numeric"
                                        value={litologiasGrupo[subIndex]?.de || ''}
                                        onChangeText={(text) =>
                                            setFieldValue(`litologias[${index}][${subIndex}].de`, text)
                                        }
                                    /> */}
                                    <View style={GlobalStyles.col2}>
                                        <NumericInput
                                            style={GlobalStyles.input}
                                            placeholder={(language === 'pt-BR' ? `De` : `From`)}
                                            value={litologiasGrupo[subIndex]?.de || ''}
                                            onChange={(text) =>
                                                setFieldValue(`litologias[${index}][${subIndex}].de`, text)}
                                            step={0.1}
                                            min={0.5}
                                            max={2.5}
                                            decimalPlaces={2}
                                        />
                                    </View>

                                    <View style={GlobalStyles.col2}>
                                        <NumericInput
                                            style={GlobalStyles.input}
                                            placeholder={(language === 'pt-BR' ? `Até` : `To`)}
                                            value={litologiasGrupo[subIndex]?.ate || ''}
                                            onChange={(text) =>
                                                setFieldValue(`litologias[${index}][${subIndex}].ate`, text)}
                                            step={0.1}
                                            min={0.5}
                                            max={2.5}
                                            decimalPlaces={2}
                                        />
                                    </View>

                                    <View style={GlobalStyles.col7}>
                                        <TextInput
                                            style={[GlobalStyles.col7, GlobalStyles.input]}
                                            placeholder=""
                                            value={litologiasGrupo[subIndex]?.tipo || ''}
                                            onChangeText={(text) =>
                                                setFieldValue(`litologias[${index}][${subIndex}].tipo`, text)
                                            }
                                        />
                                    </View>

                                    <View style={[GlobalStyles.col1]}>
                                        <Button
                                            color="orange"
                                            title="X"
                                            onPress={() => remove(subIndex)}
                                        />
                                    </View>
                                </View>
                            ))
                        )}
                    </>
                )}
            </FieldArray>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    label: { fontWeight: 'bold', flex: 1 },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_Litologia;
