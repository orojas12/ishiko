import { createRoot } from "react-dom/client";
import SignUp from "./signup";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<SignUp />);
