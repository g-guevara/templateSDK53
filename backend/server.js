require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToDatabase, authenticateUser, errorHandler, responseMiddleware } = require("./middleware");
const authRoutes = require("./auth-routes");
const appRoutes = require("./app-routes");

const app = express();

// Configuración detallada de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'User-ID'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection status check middleware
app.use(async (req, res, next) => {
  // Skip connection check for non-DB routes
  if (req.path === '/' || req.path === '/health') {
    return next();
  }
  
  try {
    // Check if we're connected, reconnect if needed
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB not connected, reconnecting...");
      await connectToDatabase();
    }
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error);
    return res.status(500).json({ error: "Database connection error" });
  }
});

// Initialize database connection
connectToDatabase()
  .then(() => console.log("Database connection ready"))
  .catch(err => console.error("MongoDB connection error:", err));

// Health check endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    status: "ok",
    dbState: dbStateMap[dbState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// Ruta de prueba para POST
app.post("/test", (req, res) => {
  console.log("Recibido POST en /test:", req.body);
  res.json({ 
    message: "POST recibido correctamente",
    body: req.body 
  });
});

// Rutas
app.use("/", authRoutes);
app.use("/", appRoutes);

// Diagnóstico endpoint
app.get("/diagnostico", async (req, res) => {
  try {
    const { User, Test, Wishlist } = require("./models");
    
    // Información del sistema
    const info = {
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
      mongoConnection: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
    };
    
    // Contar documentos en colecciones principales
    const usuarios = await User.countDocuments();
    const tests = await Test.countDocuments();
    const wishlists = await Wishlist.countDocuments();
    
    // Información adicional
    const ultimosUsuarios = await User.find().sort({ createdAt: -1 }).limit(3).select('-password');
    
    // Devolver resultado
    res.json({
      info,
      contadores: {
        usuarios,
        tests,
        wishlists
      },
      ultimosUsuarios
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de manejo de errores y respuesta
app.use(responseMiddleware);
app.use(errorHandler);

// Exportar para Vercel
module.exports = app;

// Iniciar servidor si no está en Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}