import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

const createToastStore = () => {
    const { subscribe, update } = writable<Toast[]>([]);

    const add = (message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, duration };

        update((toasts) => [...toasts, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    };

    const remove = (id: string) => {
        update((toasts) => toasts.filter((t) => t.id !== id));
    };

    return {
        subscribe,
        success: (m: string, d?: number) => add(m, 'success', d),
        error: (m: string, d?: number) => add(m, 'error', d),
        info: (m: string, d?: number) => add(m, 'info', d),
        warning: (m: string, d?: number) => add(m, 'warning', d),
        remove
    };
};

export const toasts = createToastStore();
