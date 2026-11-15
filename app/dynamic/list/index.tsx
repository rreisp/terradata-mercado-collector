import { useCallback, useState } from "react";
import { View, Text, Button, Image, StyleSheet, Pressable, FlatList, Alert, ActivityIndicator } from "react-native";
import * as Sharing from 'expo-sharing';
import Modal from "react-native-modal";
import GlobalStyles from '@/core/constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { constants } from '@/core/constants/constants';

import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "@/core/contexts/LanguageContext";
import { useOperationMode } from "@/core/contexts/OperationModeContext";
import { FormSchema } from "@/core/types/form-schema";
import { DynamicListProps } from "@/core/types/dynamic-list-props";

import schemaRegistry from "@/app-instance/schemas";

// import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeAreaContainer from "@/core/components/safe-container";
import { useFocusEffect } from '@react-navigation/native';
import { logos } from '@/app-instance/logos';
import Constants from "expo-constants";
import { EmailService } from "@/core/services/email.service";
import { BackupService } from "@/core/services/backup.service";

const { version } = Constants.expoConfig ?? {};
const buildStamp = Constants.expoConfig?.extra?.buildStamp;

const DynamicList = ({ schemaId, columns, onList, onDelete, onReset, onInit, onExport = undefined, onExportPDF = undefined, onExportAll, onImportDatabase }: DynamicListProps) => {
    const { language } = useLanguage();
    const isOnline = useOperationMode();
    const navigation = useNavigation();
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isPT = language === 'pt-BR';

    const hasExport = !!onExport;
    const hasExportAll = !!onExportAll;
    const hasExportPDF = !!onExportPDF;
    const hasImportDatabase = !!onImportDatabase

    // Determina a classe de largura dinamicamente com base nas funções de exportação disponíveis
    let centerColStyle: any = GlobalStyles.col8;
    if (!hasExport && !hasExportPDF) {
        centerColStyle = GlobalStyles.col10;
    } else if (!hasExport || !hasExportPDF) {
        centerColStyle = GlobalStyles.col9;
    }

    // ********************************************************************************************    
    // FUNÇÕES AUXILIARES
    async function loadSchema(schemaId: string) {
        const timer = setTimeout(() => setLoading(false), constants.delay);
        // Icon.loadFont();
        if (isOnline) {
            fetch(`https://capturewise.terradata.com.br/load-json.php?id=${schemaId}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormSchema(data);
                    return () => clearTimeout(timer);
                })
                .catch((err) => console.error("Erro ao carregar schema:", err));
        } else {
            const schema = schemaRegistry[schemaId];
            // console.log(schema);
            setFormSchema(schema);
            const timer = setTimeout(() => setLoading(false), constants.delay);
            return () => clearTimeout(timer);
        }
    }

    async function fetchRecords() {
        try {
            const data = await onList(language);
            setRecords(data);
        } catch (error) {
            console.error(isPT ? 'Erro ao carregar registros:' : 'Error loading records: ', error);
        } finally {
            setLoading(false);
        }
    }

    // ********************************************************************************************    
    // FUNÇÕES PARA TRATAMENTO DE EVENTOS
    async function handleDelete(rootItemId: number): Promise<void> {
        const doDelete = () => {
            onDelete(rootItemId);
            setRecords((prevRecords) => prevRecords.filter(record => record.id !== rootItemId));
        };

        const message = isPT ?
            `Tem certeza que deseja remover o item?` : `Are you sure you want to remove the item?`;

        Alert.alert(
            isPT ? 'Confirmação de Exclusão' : 'Confirmation of Deletion',
            message,
            [
                { text: isPT ? 'Cancelar' : "Cancel", style: 'cancel' },
                { text: isPT ? 'Excluir' : "Remove", style: 'destructive', onPress: doDelete }
            ],
            { cancelable: true }
        );
    }

    async function handleEdit(id: number): Promise<void> {
        navigation.navigate('loader/form/index', { schemaId, editMode: true, itemId: id }, { pop: true });
    }

    async function handleExport(rootItemId: number): Promise<void> {
        setLoading(true);
        await onExport(rootItemId);
        setLoading(false);
    }

    async function handleExportPDF(rootItemId: number): Promise<void> {
        setLoading(true);
        await onExportPDF(rootItemId);
        setLoading(false);
    }

    async function handleExportAll(): Promise<void> {
        const doExportAll = async () => {
            setModalVisible(false);
            setLoading(true);
            await onExportAll();
            Alert.alert(isPT ? 'Registros exportados.' : 'Records exported.');
            setLoading(false);
        };

        Alert.alert(
            isPT ? 'Atenção!' : 'Atention!',
            isPT ? 'Esta operação pode demorar. Deseja continuar?' : 'This operation may take some time. Do you wish to continue?',
            [
                { text: isPT ? 'Cancelar' : "Cancel", style: 'cancel' },
                { text: isPT ? 'Confirmar' : "Ok", style: 'destructive', onPress: doExportAll }
            ],
            { cancelable: true }
        );
    }

    async function handleReset(): Promise<void> {
        const doReset = () => {
            setModalVisible(false);
            onReset();
            onInit();
            setModalVisible(false);
            setRecords([]);
        };

        const msg = (isPT ? `Tem certeza que deseja apagar todos os registros?` : `Are you sure you want to delete all records?`);

        Alert.alert(
            (isPT ? `Atenção!` : `Atention!`),
            msg,
            [
                { text: (isPT ? `Cancelar` : `Cancel`), style: 'cancel' },
                { text: (isPT ? `Resetar` : `Reset`), style: 'destructive', onPress: doReset }
            ],
            { cancelable: true }
        );
    }

    async function handleImportDatabase() {
        try {
            onImportDatabase();
        } catch (error) {
            Alert.alert(isPT ? 'Erro' : 'Error', isPT ? 'Erro ao importar o banco de dados' : 'Error while importing database');
            throw error;
        }
    }

    async function handleExportDatabase() {
        try {
            const backupUri = await BackupService.exportDatabase();

            Alert.alert(
                isPT ? 'Exportar banco de dados' : 'Export database',
                isPT ? 'O que você deseja fazer com o arquivo?' : 'What do you want to do with the file?',
                [
                    {
                        text: isPT ? 'Salvar / Compartilhar' : 'Save / Share',
                        onPress: async () => {
                            if (!(await Sharing.isAvailableAsync())) {
                                Alert.alert(isPT ? 'Erro' : 'Error', isPT ? 'Compartilhamento não disponível' : 'Sharing not available');
                                return;
                            }

                            await Sharing.shareAsync(backupUri, {
                                mimeType: 'application/octet-stream',
                                dialogTitle: isPT ? 'Exportar banco de dados' : 'Export database',
                            });
                        },
                    },
                    {
                        text: 'Enviar por e-mail',
                        onPress: async () => {
                            try {
                                await EmailService.send({
                                    subject: isPT ? 'Backup do banco de dados' : 'Database backup',
                                    body: isPT ? 'Segue em anexo o backup do banco de dados.' : 'The database backup is attached.',
                                    attachments: [backupUri],
                                });
                            } catch (error) {
                                Alert.alert(isPT ? 'Erro' : 'Error', isPT ? 'E-mail não configurado no dispositivo' : 'E-mail not configured in the device');
                            }
                        },
                    },
                    {
                        text: isPT ? 'Cancelar' : 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        } catch (error) {
            Alert.alert(isPT ? 'Erro' : 'Error', isPT ? 'Erro ao exportar o banco de dados' : 'Error while exporting database');
            throw error;
        }
    }

    const goBack = () => {
        navigation.navigate('tools/index', {}, { pop: true });
    };

    const openForm = () => {
        navigation.navigate('loader/form/index', { schemaId }, { pop: true });
    };

    const showOptions = () => {
        setModalVisible(true);
    };

    // ********************************************************************************************   
    useFocusEffect(
        useCallback(() => {
            loadSchema(schemaId);
            fetchRecords();
        }, [])
    );


    return (
        <SafeAreaContainer scrollable={false}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.row]}>
                    <View style={GlobalStyles.col2}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={goBack}>
                            <Icon name="chevron-circle-left" size={16} color="#fff" />
                        </Pressable>
                    </View>
                    <View style={GlobalStyles.col8}></View>
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", marginRight: 2 }]}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={showOptions}>
                            <Icon name="gear" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                <View style={[GlobalStyles.row]}>
                    <View style={[GlobalStyles.col12, styles.center]}>
                        <Image
                            // source={require(`../../../assets/images/${formSchema?.logo || ""}`)}
                            source={logos[schemaId]}
                            style={[GlobalStyles.logo, { resizeMode: 'contain' }]}
                        />
                        <Text style={GlobalStyles.title}>{formSchema?.title[language] || ""}</Text>
                    </View>
                </View>

                <View style={GlobalStyles.row}>
                    <View style={GlobalStyles.col10}></View>
                    <View style={[GlobalStyles.col2, { alignItems: "flex-end", marginRight: 2 }]}>
                        <Pressable accessibilityRole="button" style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]} onPress={openForm}>
                            <Icon name="plus" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                <FlatList
                    data={records}
                    keyExtractor={(item) => item.id!.toString()}
                    contentContainerStyle={{ paddingBottom: 2, marginRight: 5 }}
                    renderItem={({ item }) => (
                        <View style={[GlobalStyles.row, { paddingVertical: 3 }]}>
                            <View style={[[centerColStyle]]}>
                                <View style={[GlobalStyles.row]}>
                                    {columns.map((field, index) => {
                                        const colStyle = {
                                            flex: 1 / columns.length,
                                            marginRight: 2
                                        };

                                        return (
                                            <View key={index} style={[GlobalStyles.col, colStyle]}>
                                                <Text>{item[field]}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Botão PDF (Condicional) */}
                            {hasExportPDF &&
                                <View style={[GlobalStyles.col1, { marginRight: 2, alignItems: "flex-end" }]}>
                                    <Pressable
                                        accessibilityRole="button"
                                        style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]}
                                        onPress={() => handleExportPDF(item.id)}>
                                        <Icon name="file-pdf-o" size={16} color="white" />
                                    </Pressable>
                                </View>
                            }

                            {/* Botão Salvar/Exportar Individual (Condicional) */}
                            {hasExport &&
                                <View style={[GlobalStyles.col1, { marginRight: 2, alignItems: "flex-end" }]}>
                                    <Pressable
                                        accessibilityRole="button"
                                        style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]}
                                        onPress={() => handleExport(item.id)}>
                                        <Icon name="save" size={16} color="white" />
                                    </Pressable>
                                </View>
                            }
                            
                            <View style={[GlobalStyles.col1, { marginRight: 2, alignItems: "flex-end" }]}>
                                <Pressable
                                    accessibilityRole="button"
                                    style={[GlobalStyles.primaryButton, GlobalStyles.iconButton]}
                                    onPress={() => handleEdit(item.id)}>
                                    <Icon name="edit" size={16} color="white" />
                                </Pressable>
                            </View>
                            <View style={[GlobalStyles.col1, { marginRight: 2, alignItems: "flex-end", }]}>
                                <Pressable
                                    accessibilityRole="button"
                                    style={[GlobalStyles.warnButton, GlobalStyles.iconButton]}
                                    onPress={() => handleDelete(item.id)}>
                                    <Icon name="trash" size={16} color="red" />
                                </Pressable>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.center}>
                            <Text>{isPT ? 'Nenhum registro encontrado.' : 'No records found.'}</Text>
                        </View>
                    )}
                />
            </View>

            <Modal isVisible={modalVisible} backdropColor="white" backdropOpacity={constants.opacity}>
                <View>
                    {(formSchema && formSchema.export.includes("all") && hasExportAll) &&
                        <View style={{ marginBottom: 12 }}>
                            <Button title={isPT ? "💾 Exportar todos os registros" : "💾 Export all records"} onPress={handleExportAll} />
                        </View>
                    }

                    <View style={{ marginBottom: 12 }}>
                        <Button title={isPT ? "🗃️ Exportar banco de dados" : "🗃️ Export database"} onPress={handleExportDatabase} />
                    </View>

                    {hasImportDatabase &&
                        <View style={{ marginBottom: 12 }}>
                            <Button title={isPT ? "🗃️ Importar banco de dados" : "🗃️ Import database"} onPress={handleImportDatabase} />
                        </View>
                    }
                    <View style={{ marginBottom: 12 }}>
                        <Button title={isPT ? "🗑️ Resetar banco de dados" : "🗑️ Reset database"} onPress={handleReset} />
                    </View>

                    <Button title={isPT ? "❎ Fechar" : "❎ Close"} onPress={() => setModalVisible(false)} />
                    <Text style={[GlobalStyles.textMuted, { marginTop: 5, fontSize: 10, fontStyle: 'italic' }]}>{isPT ? 'Versão ' : 'Version'} {version} {buildStamp}</Text>
                </View>
            </Modal>
        </SafeAreaContainer>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(255, 255, 255, ${constants.opacity})`,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
});

export default DynamicList;

