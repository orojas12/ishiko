import { Button } from "../../components/button";
import { Input } from "../../components/input";
import "../index.css";

export default function SignIn() {
    const csrfInput = document.getElementById("_csrf") as HTMLInputElement;

    return (
        <div className="absolute w-full h-full bg-background flex flex-col justify-center items-center">
            <form
                action="/auth/signin"
                className="flex items-center flex-col border border-border p-8 sm:p-16 rounded-lg w-full max-w-96"
                method="post"
            >
                <h1 className="text-2xl mb-8">Sign In</h1>
                <div className="w-full mb-6">
                    <label htmlFor="username">Username</label>
                    <Input id="username" name="username" required type="text" />
                </div>
                <div className="w-full mb-8">
                    <label htmlFor="password">Password</label>
                    <Input
                        id="password"
                        name="password"
                        required
                        type="password"
                    />
                </div>
                <input name="_csrf" value={csrfInput.value} type="hidden" />
                <Button className="w-full sm:w-auto">Sign In</Button>
            </form>
        </div>
    );
}
