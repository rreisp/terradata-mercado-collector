import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataRemover } from "@/core/types/data-remover";
import { DataReseter } from "@/core/types/data-reseter";
import * as Removers from "@/app-instance/scripts/delete";
import * as Reseters from "@/app-instance/scripts/reset";

import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const removerRegistry: Record<string, new () => DataRemover> = {
        ...Removers,
    };
    const reseterRegistry: Record<string, new () => DataReseter> = {
        ...Reseters,
    };    

    const remover = new removerRegistry[schemaId+"Remover"]();
    const reseter = new reseterRegistry[schemaId+"Reseter"]();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicList schemaId={schemaId} onDelete={remover.remove.bind(remover)} onReset={reseter.reset.bind(reseter)} />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;