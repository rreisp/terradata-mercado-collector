import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { View } from 'react-native';
import { Extractor } from '@/types/extractor';
import { Loader } from '@/types/loader';
import { EnergyFuelsDrillingExtractor } from '@/app-instance/extractors/energy-fuels.perfuracao.extractor';
import { EnergyFuelsDrillingLoader } from "@/app-instance/loaders/energy-fuels.perfuracao.loader";

const FormLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const editModeParam = useLocalSearchParams().editMode;
    const editMode = Array.isArray(editModeParam) ? editModeParam[0] : editModeParam;

    const itemIdParam = useLocalSearchParams().itemId;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

    const extractor: Extractor = new EnergyFuelsDrillingExtractor();
    const loader: Loader = new EnergyFuelsDrillingLoader();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicForm
                    schemaId={schemaId}
                    editMode={editMode}
                    itemId={itemId}
                    extract={extractor.extract.bind(extractor)}
                    load={loader.load.bind(loader)}
                />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
