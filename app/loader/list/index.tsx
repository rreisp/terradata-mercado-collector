import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/contexts/OperationModeContext";
import { View } from "react-native";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    return (
        <OperationModeProvider>
            <View style={{ flex: 1}}>
                <DynamicList schemaId={schemaId} />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;