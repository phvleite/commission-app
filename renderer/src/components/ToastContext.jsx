import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    function addToast(message, type = "info") {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div style={styles.container}>
                {toasts.map((toast) => (
                    <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

const styles = {
    container: {
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    toast: {
        padding: "12px 18px",
        borderRadius: "6px",
        color: "#fff",
        fontSize: "14px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        animation: "fadeIn 0.3s ease"
    },
    success: { background: "#4caf50" },
    error: { background: "#f44336" },
    info: { background: "#2196f3" },
    warning: { background: "#ff9800" }
};
