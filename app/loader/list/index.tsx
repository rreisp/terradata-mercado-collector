import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/contexts/OperationModeContext";
import { View } from "react-native";

const ListLoader = () => {
    const formIdParam = useLocalSearchParams().formId;
    const formId = Array.isArray(formIdParam) ? formIdParam[0] : formIdParam;

    return (
        <OperationModeProvider>
            <View style={{ flex: 1}}>
                <DynamicList schemaId={formId} />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;