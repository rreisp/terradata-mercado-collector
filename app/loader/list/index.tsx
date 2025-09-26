import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataReader } from "@/core/types/data-reader";
import { DataRemover } from "@/core/types/data-remover";
import { DataReseter } from "@/core/types/data-reseter";
import * as Readers from "@/app-instance/scripts/read";
import * as Removers from "@/app-instance/scripts/delete";
import * as Reseters from "@/app-instance/scripts/reset";

import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const readerRegistry: Record<string, new () => DataReader> = {
        ...Readers,
    };
    const removerRegistry: Record<string, new () => DataRemover> = {
        ...Removers,
    };
    const reseterRegistry: Record<string, new () => DataReseter> = {
        ...Reseters,
    };    

    const reader = new readerRegistry[schemaId+"Reader"]();
    const remover = new removerRegistry[schemaId+"Remover"]();
    const reseter = new reseterRegistry[schemaId+"Reseter"]();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1 }}>
                <DynamicList schemaId={schemaId} onList={reader.read.bind(reader)} columns={reader.columns()} onDelete={remover.remove.bind(remover)} onReset={reseter.reset.bind(reseter)} />
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;