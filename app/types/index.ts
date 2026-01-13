// ============================================
// SHARED TYPES
// ============================================

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

export interface DeleteModalState {
    id: string;
    name: string;
}
