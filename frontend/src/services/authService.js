import { supabase } from "../lib/supabase.js";

// Signup
export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;

    return data;
};

// Login
export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return data;
};

// Logout
export const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
};

// Get current session
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session;
};
