import { useLocalSearchParams } from "expo-router";
import { useLanguage } from "@/core/contexts/LanguageContext";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/core/contexts/OperationModeContext';
import { View } from 'react-native';

import { DataExtractor } from "@/core/types/data-extractor";
import { DataLoader } from "@/core/types/data-loader";
import { DataUpdater } from "@/core/types/data-updater";
import { DataValidator } from "@/core/types/data-validator";

import * as Extractors from "@/app-instance/scripts/create";
import * as Loaders from "@/app-instance/scripts/load";
import * as Updaters from "@/app-instance/scripts/update";
import * as Validators from "@/app-instance/scripts/validate";

const FormLoader = () => {
    const { language } = useLanguage();    
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;

    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

    const extractorRegistry: Record<string, new (language: string) => DataExtractor> = {
        ...Extractors,
    };   
    const loaderRegistry: Record<string, new () => DataLoader> = {
        ...Loaders,
    };
    const updaterRegistry: Record<string, new (language: string) => DataUpdater> = {
        ...Updaters,
    };    
    const validatorRegistry: Record<string, new (language: string) => DataValidator> = {
        ...Validators,
    };           

    const extractor: DataExtractor = new extractorRegistry[schemaId+"Extractor"](language);
    const loader: DataLoader = new loaderRegistry[schemaId+"Loader"]();
    const updater: DataUpdater = new updaterRegistry[schemaId+"Updater"](language);
    const validator: DataValidator = new validatorRegistry[schemaId+"Validator"](language);

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
