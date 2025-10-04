import { createContext } from "react";
import type { NavigationContextModel } from "./context.model";

export const NavigationContext = createContext<null | NavigationContextModel>(null);