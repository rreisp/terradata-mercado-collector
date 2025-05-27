export type FormSchema = {
    form_id: string;
    title: string;
    description: string;
    version: string;
    method: string;
    url: string;
    modal: {
        size: string;
        success: {
            header: string;
            message: string;
            button: string;
        };
        error: {
            header: string;
            message: string;
            button: string;
        };
    };
    grid: {
        columns: number;
        spacing: number;
    };
    rows: Array<{
        type: string;
        name?: string;
        label?: string;
        placeholder?: string;
        options?: { label: string; value: string }[];
        required?: boolean;
        [key: string]: any;
    }>;
};