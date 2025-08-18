import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Section from './section';
import Icon from 'react-native-vector-icons/FontAwesome5'; // ou FontAwesome5, se quiser usar a versão 5
import GlobalStyles from '../../../../../constants/styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormikContext } from 'formik';

const EF_DepthResearch = ({ parent }: { parent: string }) => {
    const { language } = useLanguage();
    const { values, setFieldValue } = useFormikContext();
    // const [elements, setElements] = useState<{ id: number }[]>(values?.[parent]?.depth ?? []);
    const [elements, setElements] = useState<{ id: number }[]>([]);

    useEffect(() => {
        setElements(values?.[parent]?.segmentIds.map(id => ({ id })));
    }, []);

    const handleAddElement = () => {
        const id = Date.now();
        if(!elements){
            setElements([]);
        }
        setElements(prev => [...prev, { id }]);
    };

    const handleRemoveElement = (id: number) => {
        const confirmAndRemove = () => {
            const index = elements.findIndex(el => el.id === id);
            if (index !== -1) {
                setElements(prev => prev.filter((_, i) => i !== index));
            }
        };
        const msg = (language === 'pt-BR' ? `Tem certeza que deseja remover o segmento?` : `Are you sure you want to remove the segment?`);
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(msg);
            if (confirmed) confirmAndRemove();
        } else {
            Alert.alert(
                (language === 'pt-BR' ? `Confirmação` : `Confirmation`),
                msg,
                [
                    { text: (language === 'pt-BR' ? `Cancelar` : `Cancel`), style: 'cancel' },
                    { text: (language === 'pt-BR' ? `Remover` : `Delete`), style: 'destructive', onPress: confirmAndRemove }
                ],
                { cancelable: true }
            );
        }
    };

    return (
        <View>
            {!elements || elements.length === 0 ? (
                <Text style={styles.emptyText}>{language === 'pt-BR' ? `Nenhum segmento adicionado.` : `No segment added.`}</Text>
            ) : (
                elements.map((el, index) => (
                    <View key={el.id}>
                        <Section index={index} el={el} size={elements.length} parent={parent} />
                        <View>
                            {index == elements.length - 1 &&
                                <TouchableOpacity style={[(index == elements.length - 1 ? GlobalStyles.warnButton : GlobalStyles.disabledButton), { marginVertical: 1 }]} onPress={() => handleRemoveElement(el.id)} disabled={index !== elements.length - 1}>
                                    <View style={GlobalStyles.row}>
                                        <Icon name="trash" size={16} color="#fff" style={styles.icon} />
                                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `REMOVER SEGMENTO ${index + 1}` : `REMOVE SEGMENT ${index + 1}`}</Text>
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
                        <Text style={styles.buttonText}>{language === 'pt-BR' ? `ADICIONAR SEGMENTO` : `ADD SEGMENT`}</Text>
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
