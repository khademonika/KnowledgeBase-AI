import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import searchRoutes from "./routes/searchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { supabase } from "./config/supabase.js"
import documentRoutes from "./routes/documentRoutes.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);

app.get("/",(req,res)=>{
    res.json({
  "message": "KnowledgeBase AI API is running"
})
})
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KnowledgeBase AI backend is connected!"
  });
});
app.get("/api/test-db", async (req, res) => {
    const { data, error } = await supabase
        .from("documents")
        .select("*")
        .limit(1);

    if (error) {
        return res.status(500).json({
            message: "Supabase connection failed",
            error: error.message
        });
    }

    res.json({
        message: "Supabase connection successful",
        data
    });
});
app.get("/api/protected", authenticateUser, (req, res) => {
    res.json({
        message: "You are authenticated!",
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
    
})