import axios from "axios";
import { supabase } from "../lib/supabase";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use(
  async (config) => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;