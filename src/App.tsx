import { Layout } from "./modules/layout/layout";
import { NavigationContextProvider } from "./contexts/navigation-context/navigation-context-provider";

export const App = () => {
  return (
    <NavigationContextProvider>
      <Layout />
    </NavigationContextProvider>
  );
};

export default App;
