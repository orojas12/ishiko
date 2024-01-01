import { createRoot } from "react-dom/client";
import SignIn from "./signin";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<SignIn />);
