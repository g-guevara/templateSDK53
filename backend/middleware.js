const mongoose = require("mongoose");
const { User, Test, Wishlist } = require("./models");

// Connection pooling implementation
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  // Connection options optimized for serverless
  const options = {
    dbName: "sensitivv",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Adjust based on your needs
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  };

  // Connect to the database
  const client = await mongoose.connect(process.env.MONGODB_URI, options);
  console.log("Connected to MongoDB");
  
  cachedDb = client;
  return client;
}

// Connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
  connectToDatabase();
});

// Simple ID-based Authentication Middleware
const authenticateUser = async (req, res, next) => {
  console.log('=========== AUTENTICACIÓN ===========');
  console.log('Headers recibidos:', JSON.stringify(req.headers));
  
  // Intentar obtener el ID de usuario de diferentes formas posibles
  const userId = req.headers['user-id'] || req.headers['User-ID'] || req.headers['userid'] || req.headers['userID'];
  
  console.log('User-ID encontrado:', userId || 'NO ENCONTRADO');
  
  if (!userId) {
    console.log('Error: No se proporcionó User-ID');
    return res.status(401).json({ error: "Authentication required - Missing User-ID" });
  }

  try {
    // Buscar usuario en la base de datos
    console.log('Buscando usuario con ID:', userId);
    const user = await User.findOne({ userID: userId });
    
    // Si no se encuentra por userID, intentar con _id
    if (!user) {
      console.log('Usuario no encontrado por userID, intentando por _id');
      const userById = await User.findOne({ _id: userId });
      
      if (userById) {
        console.log('Usuario encontrado por _id');
        req.user = {
          userID: userById._id.toString(), // Convertir ObjectId a string si es necesario
          email: userById.email,
          name: userById.name
        };
        return next();
      }
      
      console.log('Error: Usuario no encontrado');
      return res.status(403).json({ error: "Invalid user ID" });
    }
    
    // Si llegamos aquí, el usuario se encontró correctamente
    console.log('Usuario autenticado correctamente:', user.name);
    
    // Adjuntar información del usuario a la solicitud
    req.user = {
      userID: user.userID,
      email: user.email,
      name: user.name
    };
    
    // Comprobar que las colecciones existan para este usuario
    const testForUser = await Test.findOne({ userID: user.userID });
    const wishlistForUser = await Wishlist.findOne({ userID: user.userID });
    
    console.log('Test para usuario:', testForUser ? 'Existe' : 'No existe');
    console.log('Wishlist para usuario:', wishlistForUser ? 'Existe' : 'No existe');
    
    console.log('=========== FIN AUTENTICACIÓN ===========');
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      error: "Authentication error", 
      details: error.message 
    });
  }
};

// Middleware de manejo de errores global
const errorHandler = (err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    message: err.message 
  });
};

// Middleware para asegurar que todas las respuestas sean JSON
const responseMiddleware = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    if (typeof body === 'string' && !res.get('Content-Type')?.includes('json')) {
      res.set('Content-Type', 'application/json');
      body = JSON.stringify({ message: body });
    }
    return originalSend.call(this, body);
  };
  next();
};

module.exports = {
  connectToDatabase,
  authenticateUser,
  errorHandler,
  responseMiddleware
};