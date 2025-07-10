import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root-stack-param-list';
import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { Extractor } from '@/types/extractor';
import { EnergyFuelsDrillingExtractor } from '@/extractors/energy-fuels.perfuracao.extractor';

type FormLoaderRouteProp = RouteProp<RootStackParamList, 'loader/form/index'>;

const FormLoader = () => {
    const extractor: Extractor = new EnergyFuelsDrillingExtractor();

    const route = useRoute<FormLoaderRouteProp>();
    const formIdParam = useLocalSearchParams().formId;
    const formId = typeof formIdParam === 'string'
        ? formIdParam
        : Array.isArray(formIdParam)
            ? formIdParam[0]
            : String(formIdParam);

    console.warn(formId);

    return (
        <OperationModeProvider>
            <DynamicForm schemaId={formId} extract={extractor.extract.bind(extractor)} />
        </OperationModeProvider>
    );
};

export default FormLoader;
