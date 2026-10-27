const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const AddToCartModel = require("../models/product_model/common/addToCart.model.js");

let io;

const emitCartCount = async (userId) => {
  if (!io || !userId) return;
  try {
    const cartCount = await AddToCartModel.countDocuments({ userId });
    io.to(`cart:${userId}`).emit("cartUpdated", { cartCount });
  } catch (error) {
    console.error("emitCartCount error:", error.message);
  }
};

const initSocket = (server, corsOrigin) => {
  io = new Server(server, {
    cors: { origin: corsOrigin, credentials: true },
  });

  // parse cookies on the handshake request so the auth token is readable
  io.engine.use(cookieParser());

  io.use((socket, next) => {
    try {
      const token = socket.request.cookies?.token;
      if (!token) return next(new Error("Not authenticated"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(decoded.userId);
      next();
    } catch (error) {
      next(new Error("Invalid or expired session"));
    }
  });

  io.on("connection", (socket) => {
    // client sends its userId, but only the authenticated user's room is joined
    socket.on("joinCart", () => {
      socket.join(`cart:${socket.userId}`);
      emitCartCount(socket.userId);
    });
  });

  return io;
};

module.exports = { initSocket, emitCartCount };
