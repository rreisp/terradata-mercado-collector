import { useLocalSearchParams } from "expo-router";
import { useLanguage } from "@/core/contexts/LanguageContext";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/core/contexts/OperationModeContext';
import { View, Text } from 'react-native';

import { DataExtractor } from "@/core/types/data-extractor";
import { DataLoader } from "@/core/types/data-loader";
import { DataUpdater } from "@/core/types/data-updater";
import { DataValidator } from "@/core/types/data-validator";

import * as Extractors from "@/app-instance/scripts/create";
import * as Loaders from "@/app-instance/scripts/load";
import * as Updaters from "@/app-instance/scripts/update";
import * as Validators from "@/app-instance/scripts/validate";
import GlobalStyles from '@/core/constants/styles';

const FormLoader = () => {
    const { language } = useLanguage();
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    // Se o schemaId ainda não estiver disponível, exibe um loading ou vazio para evitar quebras
    if (!schemaId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        );
    }
    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;
    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;
    
    const extractorRegistry: Record<string, new (language: string) => DataExtractor> = { ...Extractors, };
    const loaderRegistry: Record<string, new () => DataLoader> = { ...Loaders, };
    const updaterRegistry: Record<string, new (language: string) => DataUpdater> = { ...Updaters, };
    const validatorRegistry: Record<string, new (language: string) => DataValidator> = { ...Validators, };

    // ***************************************************************************************
    // Verificação de segurança para alertar ausência de classes
    const ExtractorClass = extractorRegistry[schemaId + "Extractor"];
    const LoaderClass = loaderRegistry[schemaId + "Loader"];
    const UpdaterClass = updaterRegistry[schemaId + "Updater"];
    const ValidatorClass = validatorRegistry[schemaId + "Validator"];

    const renderErroSchemaNaoEncontrado = (schemaId: string, script: string) => (
        <View style={GlobalStyles.errorContainer}>
            <View style={GlobalStyles.errorBox}>
                <Text style={GlobalStyles.errorText}>
                    Erro: Script "{script}" não encontrado para o schema "{schemaId}".
                </Text>
            </View>
        </View>
    );
    if (!ExtractorClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Extractor")); }
    if (!LoaderClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Loader")); }
    if (!UpdaterClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Updater")); }
    if (!ValidatorClass) { return (renderErroSchemaNaoEncontrado(schemaId, "Validator")); }    

    // ***************************************************************************************     
    const extractor: DataExtractor = new extractorRegistry[schemaId + "Extractor"](language);
    const loader: DataLoader = new loaderRegistry[schemaId + "Loader"]();
    const updater: DataUpdater = new updaterRegistry[schemaId + "Updater"](language);
    const validator: DataValidator = new validatorRegistry[schemaId + "Validator"](language);

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicForm
                    schemaId={schemaId}
                    editMode={editMode}
                    itemId={itemId}
                    onLoad={loader.load.bind(loader)}
                    onExport={extractor.extract.bind(extractor)}
                    onUpdate={updater.update.bind(updater)}
                    onValidate={validator.validate.bind(validator)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
