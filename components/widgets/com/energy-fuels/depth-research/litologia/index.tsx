import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFormikContext, FieldArray } from 'formik';
import GlobalStyles from '../../../../../../constants/styles';
import NumericInput from '../../../../../widgets/input/number';

const EF_Litologia = ({ index }) => {
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
                        <View style={styles.row}>
                            <Text style={styles.label}>Litologia {index + 1}:</Text>
                            <View style={GlobalStyles.col1}>
                                <Button title="+" onPress={() => push({ de: '', ate: '', tipo: '' })} />
                            </View>
                        </View>
                        {litologiasGrupo.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhum item adicionado.</Text>
                        ) : (
                            litologiasGrupo.map((_, subIndex) => (
                                <View key={subIndex} style={styles.row}>
                                    {/* <TextInput
                                        style={[GlobalStyles.col2, styles.input]}
                                        placeholder="De"
                                        keyboardType="numeric"
                                        value={litologiasGrupo[subIndex]?.de || ''}
                                        onChangeText={(text) =>
                                            setFieldValue(`litologias[${index}][${subIndex}].de`, text)
                                        }
                                    /> */}
                                    <NumericInput
                                        style={[GlobalStyles.col2, styles.input]}
                                        placeholder="De"
                                        value={litologiasGrupo[subIndex]?.de || ''}
                                        onChange={(text) =>
                                            setFieldValue(`litologias[${index}][${subIndex}].de`, text)}
                                        step={0.1}
                                        min={0.5}
                                        max={2.5}
                                        decimalPlaces={2}
                                    />
                                    <NumericInput
                                        placeholder="Até"
                                        value={litologiasGrupo[subIndex]?.ate || ''}
                                        onChange={(text) =>
                                            setFieldValue(`litologias[${index}][${subIndex}].ate`, text)}
                                        step={0.1}
                                        min={0.5}
                                        max={2.5}
                                        decimalPlaces={2}
                                    />
                                    <TextInput
                                        style={[GlobalStyles.col7, styles.input]}
                                        placeholder="Litologia"
                                        value={litologiasGrupo[subIndex]?.tipo || ''}
                                        onChangeText={(text) =>
                                            setFieldValue(`litologias[${index}][${subIndex}].tipo`, text)
                                        }
                                    />
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
    row: { flexDirection: 'row', marginVertical: 5, marginLeft: 5 },
    label: { fontWeight: 'bold', flex: 1 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginHorizontal: 2,
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#777',
        marginVertical: 4,
        marginLeft: 4,
    },
});

export default EF_Litologia;
