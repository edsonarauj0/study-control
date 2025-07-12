import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ModalContextType = {
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalContent, setModalContent] = useState<ReactNode>(null);

    const openModal = (content: ReactNode) => {
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
                <Dialog open={!!modalContent} onOpenChange={(open: boolean) => {
                    if (!open) closeModal();
                }}>
                <DialogContent>
                    <DialogTitle asChild>
                        <VisuallyHidden>Título do modal</VisuallyHidden>
                    </DialogTitle>
                    {modalContent}
                </DialogContent>
            </Dialog>
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
