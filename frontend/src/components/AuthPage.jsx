
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
    const { login, signUp } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const data = await signUp(email, password);

                if (!data.session) {
                    setMessage(
                        "Account created! Please check your email to verify your account."
                    );
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-[#0e0f11]">
            <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#17181c]">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-stone-900 dark:text-white">
                        KnowledgeBase AI
                    </h1>

                    <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                        {isLogin
                            ? "Welcome back! Sign in to continue."
                            : "Create your account to get started."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-xl border border-stone-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            minLength={6}
                            required
                            className="w-full rounded-xl border border-stone-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {message && (
                        <p className="text-sm text-green-600">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                            ? "Sign In"
                            : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setMessage("");
                        }}
                        className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
