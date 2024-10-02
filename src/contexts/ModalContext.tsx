import { createContext } from "react";

export enum ModalState {
  HIDDEN = "HIDDEN",
  LOGIN = "LOGIN",
  LOGIN_SAVED_BUILDINGS = "LOGIN_SAVED_BUILDINGS",
  RESET = "RESET",
  SIGNUP = "SIGNUP",
  REP_SIGNUP = "REP_SIGNUP",
}

export const ModalContext = createContext<any[]>([]);
