import { ComponentType, ReactNode } from "react";

export default interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: ComponentType<any>;
  wrapWith?: ComponentType<{ children: ReactNode }>[];
  props?: Record<string, unknown>;
}
