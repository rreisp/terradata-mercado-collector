import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/core/contexts/OperationModeContext';
import { View } from 'react-native';

import { DataExtractor } from "@/core/types/data-extractor";
import { DataLoader } from '@/core/types/data-loader';
import { DataUpdater } from '@/core/types/data-updater';

import * as Extractors from "@/app-instance/scripts/create";
import * as Loaders from "@/app-instance/scripts/load";
import * as Updaters from "@/app-instance/scripts/update";

const FormLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;

    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

    const extractorRegistry: Record<string, new () => DataExtractor> = {
        ...Extractors,
    };   
    const loaderRegistry: Record<string, new () => DataLoader> = {
        ...Loaders,
    };
    const updaterRegistry: Record<string, new () => DataUpdater> = {
        ...Updaters,
    };       


    const extractor: DataExtractor = new extractorRegistry[schemaId+"Extractor"]();
    const loader: DataLoader = new loaderRegistry[schemaId+"Loader"]();
    const updater: DataUpdater = new updaterRegistry[schemaId+"Updater"]();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicForm
                    schemaId={schemaId}
                    editMode={editMode}
                    itemId={itemId}
                    load={loader.load.bind(loader)}
                    extract={extractor.extract.bind(extractor)}
                    update={updater.update.bind(updater)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
