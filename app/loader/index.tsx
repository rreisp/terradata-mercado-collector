import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types';
import { useLocalSearchParams } from "expo-router";
import DynamicForm from '../dynamic/_index';

type FormLoaderRouteProp = RouteProp<RootStackParamList, 'loader/index'>;

const FormLoader = () => {
    const route = useRoute<FormLoaderRouteProp>();
    const formIdParam = useLocalSearchParams().formId;
    const formId = Array.isArray(formIdParam) ? formIdParam[0] : formIdParam;    
    
    return (
        <View>
            <Text>Carregando formulário: {formId}</Text>
            <DynamicForm schema={formId}/>
        </View>
    );
};

export default FormLoader;