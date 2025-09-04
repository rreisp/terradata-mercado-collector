import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/core/contexts/OperationModeContext';
import { View } from 'react-native';
import { DataLoader } from '@/core/types/data-loader';
import { DataExtractor } from '@/core/types/extractor';
import { DataUpdater } from '@/core/types/data-updater';
import { EnergyFuelsDrillingExtractor } from '@/app-instance/scripts/create/energy-fuels.perfuracao.extractor';
import { EnergyFuelsDrillingLoader } from "@/app-instance/scripts/load/energy-fuels.perfuracao.loader";
import { EnergyFuelsDrillingUpdater } from "@/app-instance/scripts/update/energy-fuels.perfuracao.updater";

const FormLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;

    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

    const loader: DataLoader = new EnergyFuelsDrillingLoader();
    const extractor: DataExtractor = new EnergyFuelsDrillingExtractor();
    const updater: DataUpdater = new EnergyFuelsDrillingUpdater();

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
