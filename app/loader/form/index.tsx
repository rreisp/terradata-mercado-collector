import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { Extractor } from '@/types/extractor';
import { EnergyFuelsDrillingExtractor } from '@/extractors/energy-fuels.perfuracao.extractor';
import { View } from 'react-native';

const FormLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;
    const extractor: Extractor = new EnergyFuelsDrillingExtractor();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicForm schemaId={schemaId} extract={extractor.extract.bind(extractor)} />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
