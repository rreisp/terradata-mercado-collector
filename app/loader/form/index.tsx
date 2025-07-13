import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { Extractor } from '@/types/extractor';
import { EnergyFuelsDrillingExtractor } from '@/extractors/energy-fuels.perfuracao.extractor';
import { View } from 'react-native';

const FormLoader = () => {
    const extractor: Extractor = new EnergyFuelsDrillingExtractor();

    const formIdParam = useLocalSearchParams().formId;
    const formId = typeof formIdParam === 'string'
        ? formIdParam
        : Array.isArray(formIdParam)
            ? formIdParam[0]
            : String(formIdParam);

    return (
        <OperationModeProvider>
            <View style={{ flex: 1}}>
                <DynamicForm schemaId={formId} extract={extractor.extract.bind(extractor)} />
            </View>
        </OperationModeProvider>
    );
};

export default FormLoader;
