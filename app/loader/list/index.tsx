import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/root-stack-param-list';
import { useLocalSearchParams } from "expo-router";
import DynamicList from '../../dynamic/list/index';

type ListLoaderRouteProp = RouteProp<RootStackParamList, 'loader/list/index'>;

const ListLoader = () => {
    // const route = useRoute<ListLoaderRouteProp>();
    const formIdParam = useLocalSearchParams().formId;
    const formId = Array.isArray(formIdParam) ? formIdParam[0] : formIdParam;

    return (
        <DynamicList schemaId={formId} />
    );
};

export default ListLoader;