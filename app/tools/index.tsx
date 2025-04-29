import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/types";


type Form = {
    id: string;
    title: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'loader/index'>;

const Tools = () => {
    const [loading, setLoading] = useState(true);
    const [availableForms, setAvailableForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<string | undefined>();
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const fetchFormConfig = async () => {
            try {
                const response = await fetch('https://capturewise.terradata.com.br/list-json.php');
                const json = await response.json();
                setAvailableForms(json);
            } catch (error) {
                console.error('Erro ao buscar configurações dos formulários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormConfig();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
            ) : availableForms.length === 0 ? (
                <Text>Nenhum formulário disponível.</Text>
            ) : (
                <>
                    <Text style={styles.title}>FERRAMENTAS</Text>
                    <Text style={styles.subtitle}>Escolha o formulário em que deseja trabalhar:</Text>
                    <Picker
                        selectedValue={selectedForm}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedForm(itemValue);
                            if (itemValue) {
                                navigation.navigate('loader/index', { formId: itemValue });
                            }
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="SELECIONE" value={null} />
                        {availableForms.map((form) => (
                            <Picker.Item key={form.id} label={form.title} value={form.id} />
                        ))}
                    </Picker>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: "100%",
    },
});

export default Tools;
