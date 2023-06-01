import { store } from "@/stores/app";
import { Provider } from "react-redux";

interface AppProviderProps {
  children?: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
