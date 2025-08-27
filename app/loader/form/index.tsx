import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { View } from 'react-native';
import { DataExtractor as DataExtractor } from '@/types/data-extractor';
import { DataLoader } from '@/types/data-loader';
import { EnergyFuelsDrillingExtractor } from '@/app-instance/extractors/energy-fuels.perfuracao.extractor';
import { EnergyFuelsDrillingUpdater } from '@/app-instance/updaters/energy-fuels.perfuracao.updater';
import { EnergyFuelsDrillingLoader } from "@/app-instance/loaders/energy-fuels.perfuracao.loader";
import { DataUpdater } from "@/types/data-updater";

const FormLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;

    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

    const dataLoader: DataLoader = new EnergyFuelsDrillingLoader();
    const dataExtractor: DataExtractor = new EnergyFuelsDrillingExtractor();
    const dataUpdater: DataUpdater = new EnergyFuelsDrillingUpdater();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicForm
                    schemaId={schemaId}
                    editMode={editMode}
                    itemId={itemId}
                    load={dataLoader.load.bind(dataLoader)}
                    extract={dataExtractor.extract.bind(dataExtractor)}
                    update={dataUpdater.update.bind(dataUpdater)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
