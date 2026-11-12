import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import Input from "./components/Input";
import Output from "./components/Output";
import { useEffect } from "react";
import { API } from "./services/api";

export default function App() {
    const { user, loading, logout } = useAuth();
useEffect(()=>{
  async  function  fetch(){
   const data =  await API.get("/api/health")
console.log(data.data.message);

  }
fetch()
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