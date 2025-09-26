export type ModalConfig = {
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