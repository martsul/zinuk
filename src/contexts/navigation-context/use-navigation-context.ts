import { useContext } from "react"
import type { NavigationContextModel } from "./context.model"
import { NavigationContext } from "."

export const useNavigationContext = () => {
  const contextData: NavigationContextModel | null = useContext(NavigationContext);

  if (!contextData) {
    throw new Error("Navigation Context Error");
  }

  return contextData;
}