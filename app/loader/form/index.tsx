import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root-stack-param-list';
import { useLocalSearchParams } from "expo-router";
import DynamicForm from '@/app/dynamic/form';
import { OperationModeProvider } from '@/contexts/OperationModeContext';
import { extract as extractDrilling } from '@/extractors/energy-fuels.perfuracao';

type FormLoaderRouteProp = RouteProp<RootStackParamList, 'loader/form/index'>;

const FormLoader = () => {
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
            <DynamicForm schemaId={formId} extract={extractDrilling} />
        </OperationModeProvider>
    );
};

export default FormLoader;
