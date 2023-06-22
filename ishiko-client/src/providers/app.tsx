import { store } from "@/stores/app";
import { Provider as StoreProvider } from "react-redux";
import ThemeProvider from "./theme";

interface AppProviderProps {
  children?: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <StoreProvider store={store}>{children}</StoreProvider>;
    </ThemeProvider>
  );
}
