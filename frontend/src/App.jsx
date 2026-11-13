import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Input from "./components/Input";
import Output from "./components/Output";
import { useEffect } from "react";
import API  from "./services/api";
import { supabase } from "./lib/supabase";

export default function App() {
    const { user, loading, logout } = useAuth();
    
useEffect(()=>{
const testProtectedAPI = async () => {
  try {
    const response = await API.get("/api/protected");
const { data, error } = await supabase.auth.getSession();

console.log("Error:", error);
console.log("Session exists:", !!data.session);
console.log("Token exists:", !!data.session?.access_token);
console.log(data.session?.access_token);

    console.log(response.data);
  } catch (error) {
    console.error(
      "Authentication failed:",
      error.response?.data || error.message
    );
  }
};

testProtectedAPI()
},[])
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <AuthPage />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <main className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-end p-3">
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>

                <Output />
                <Input />
            </main>
        </div>
    );
}