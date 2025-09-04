import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';
import { OperationModeProvider } from "@/core/contexts/OperationModeContext";
import { View } from "react-native";
import { DataRemover } from "@/core/types/data-remover";
import { EnergyFuelsDrillingRemover } from "@/app-instance/scripts/delete/energy-fuels.perfuracao.remover";

const ListLoader = () => {
    const schemaIdParam = useLocalSearchParams().schemaId;
    const schemaId = Array.isArray(schemaIdParam) ? schemaIdParam[0] : schemaIdParam;

    const remover: DataRemover = new EnergyFuelsDrillingRemover();

    return (
        <OperationModeProvider>
            <View style={{ flex: 1}}>
                <DynamicList schemaId={schemaId} onDelete={remover.remove.bind(remover)}/>
            </View>
        </OperationModeProvider>
    );
};

export default ListLoader;