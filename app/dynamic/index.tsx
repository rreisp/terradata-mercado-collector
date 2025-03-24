import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Button,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '../../constants/colors'; // Certifique-se de que as cores estejam definidas corretamente

interface FormConfig {
    form_id: string;
    title: string;
    description: string;
    version: string;
    grid: {
        columns: number;
        gap: string;
    };
    rows: {
        columns: {
            field: Field;
            size: {
                xs: number;
                sm: number;
                md: number;
                lg: number;
                xl: number;
            };
        }[];
    }[];
}

// Definindo a interface para o campo
interface Field {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    validations?: {
        min_length?: number;
        max_length?: number;
    };
}

// Definindo a interface para o FormField
interface FormFieldProps {
    field: Field;
    control: any; // Ou use o tipo apropriado para o seu controle
}

// Definindo o esquema de validação com zod
const schema = z.object({
    nome_completo: z.string().min(1, { message: "O nome completo é obrigatório" }),
    email: z.string().email({ message: "E-mail inválido" }).min(1, { message: "O e-mail é obrigatório" }),
    cpf: z.string().min(11, { message: "CPF deve ter pelo menos 11 caracteres" }).max(14, { message: "CPF deve ter no máximo 14 caracteres" }),
    telefone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 caracteres" }).max(15, { message: "Telefone deve ter no máximo 15 caracteres" }),
    instituicao: z.string().min(1, { message: "A instituição é obrigatória" }),
    cargo: z.string().min(1, { message: "O cargo é obrigatório" }),
    modalidade_participacao: z.string().min(1, { message: "A modalidade de participação é obrigatória" }),
    senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmar_senha: z.string().min(1, { message: "A confirmação da senha é obrigatória" }),
});

// Inferindo o tipo de dados do formulário
type FormData = z.infer<typeof schema>;

const FormField: React.FC<FormFieldProps> = ({ field, control }) => {
    const { type, label, placeholder, required, validations } = field;
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <Controller
                control={control}
                name={field.id}
                rules={{
                    required: required ? `${label} é obrigatório` : false,
                    minLength: validations?.min_length ? {
                        value: validations.min_length,
                        message: `${label} deve ter pelo menos ${validations.min_length} caracteres`,
                    } : undefined,
                    maxLength: validations?.max_length ? {
                        value: validations.max_length,
                        message: `${label} deve ter no máximo ${validations.max_length} caracteres`,
                    } : undefined,
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={type === 'email' ? 'email-address' : 'default'}
                        secureTextEntry={type === 'password'}
                    />
                )}
            />
        </View>
    );
};

export default function DynamicForm() {
    const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const fetchFormConfig = async () => {
            try {
                const response = await fetch('http://capturewise.terradata.com.br/json/dialeto.cadastro.json');
                const json = await response.json();
                console.log(json.rows[0].columns);
                setFormConfig(json);
            } catch (error) {
                console.error('Error fetching form config:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormConfig();
    }, []);

    const onSubmit = (data: FormData) => { // Tipando o parâmetro data
        console.log('Form Data:', data);
        // router.push('/nextPage'); // Redirecione conforme necessário
    };

    if (loading) {
        return <ActivityIndicator size="large" color={colors.blue} />;
    }

    // Verifique se formConfig é nulo
    if (!formConfig) {
        return (
            <View>
                <Text>Carregando o formulário...</Text>
            </View>
        );
    }

    type Field = {
        id: string;
        label: string;
        type: string;
        // Adicione outras propriedades conforme necessário
    };

    type Column = {
        field: Field;
    };

    type Row = {
        columns: Column[];
    };


    // -------------------------------------------------------------
    // FUNÇÕES DE RENDERIZAÇÃO ESPECÍFICAS

    const renderTextInput = (column: Column) => (
        <FormField key={column.field.id} field={column.field} control={control} />
    );

    const renderNumberInput = (column: Column) => (
        <FormField key={column.field.id} field={column.field} control={control} />
    );

    const renderEmailInput = (column: Column) => (
        <FormField key={column.field.id} field={column.field} control={control} />
    );

    const renderPasswordInput = (column: Column) => (
        <FormField
            key={column.field.id}
            field={column.field}
            control={control}
        // secureTextEntry={true}
        />
    );

    const renderDropdownInput = (column: Column) => (
        <FormField
            key={column.field.id}
            field={column.field}
            control={control}
        // options={column.field.options}
        />
    );

    // -------------------------------------------------------------
    // FUNÇÕES DE RENDERIZAÇÃO BÁSICAS

    const renderInput = (column: Column) => {
        switch (column.field.type) {
            case 'text':
                return renderTextInput(column);
            case 'number':
                return renderNumberInput(column);
            case 'email':
                return renderEmailInput(column);
            case 'password':
                return renderPasswordInput(column);
            case 'dropdown':
                return renderDropdownInput(column);
            default:
                return renderTextInput(column);
        }
    };

    const renderRow = (row: Row, rowIndex: number, control: any) => (
        <View key={rowIndex} style={styles.row}>
            {row.columns.map((column, columnIndex) => (
                <View key={columnIndex}>
                    {renderInput(column)}
                </View>
            ))}
        </View>
    );


    return (
        <ScrollView style={styles.container}>
            {formConfig.rows.map((row, rowIndex) => renderRow(row, rowIndex, control))}
            {/* ... botão de submit */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    row: {
        display: "flex",
    },
    fieldContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 4,
        padding: 8,
        color: colors.black,
        backgroundColor: colors.white,
        margin: 2,
        flex: 1
    },
    button: {
        backgroundColor: colors.blue,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});
