import { createContext } from "react"

export enum ModalState {
  HIDDEN = 'HIDDEN',
  LOGIN = 'LOGIN',
  RESET = 'RESET',
  SIGNUP = 'SIGNUP'
}

export const ModalContext = createContext<any[]>([]);
