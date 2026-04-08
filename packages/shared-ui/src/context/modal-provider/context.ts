import { createContext } from 'react';
import type { ModalContextType } from './type';

export const ModalContext = createContext<ModalContextType | null>(null);
