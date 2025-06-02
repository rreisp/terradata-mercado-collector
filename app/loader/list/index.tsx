import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';

const ListLoader = () => {
    const formIdParam = useLocalSearchParams().formId;
    const formId = Array.isArray(formIdParam) ? formIdParam[0] : formIdParam;

    return (
        <DynamicList schemaId={formId} />
    );
};

export default ListLoader;