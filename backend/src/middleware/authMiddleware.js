// import { supabase } from "../config/supabase.js";

// export const authenticateUser = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({
//                 message: "Access token is required",
//             });
//         }

//         const token = authHeader.split(" ")[1];

//         const { data, error } = await supabase.auth.getUser(token);

//         if (error || !data.user) {
//             return res.status(401).json({
//                 message: "Invalid or expired access token",
//             });
//         }

//         req.user = data.user;

//         // Reuse the existing Supabase client configuration
//         req.supabase = supabase;
//         req.supabase = createClient(
//   supabaseUrl,
//   supabaseKey,
//   {
//     global: {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   }
// );

//         next();

//     } catch (error) {
//         console.error("Authentication error:", error);

//         return res.status(500).json({
//             message: "Internal authentication error",
//         });
//     }
// };


import { createClient } from "@supabase/supabase-js";
import 
    {supabase,
    supabaseUrl,
    supabaseKey}
from "../config/supabase.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify the user's access token
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                message: "Invalid or expired access token",
            });
        }

        // Store authenticated user information
        req.user = data.user;

        // Create a user-scoped Supabase client
        req.supabase = createClient(
            supabaseUrl,
            supabaseKey,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Internal authentication error",
        });
    }
};
