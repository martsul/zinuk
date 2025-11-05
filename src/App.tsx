import { Layout } from "./modules/layout/layout";
import { NavigationContextProvider } from "./contexts/navigation-context/navigation-context-provider";
import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    const url: URL = new URL(window.location.href);
    const endpoints: string[] = url.pathname.split("/");
    const html: HTMLElement = document.documentElement;
    if (endpoints.includes("en")) {
      html.lang = "en";
    } else {
      html.lang = "he-IL";
      document.body.classList.add("rtl");
    }
  }, []);

  return (
    <NavigationContextProvider>
      <Layout />
    </NavigationContextProvider>
  );
};

export default App;
