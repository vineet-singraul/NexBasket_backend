const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const storeRoutes = require("./routes/store.routes.js");
const createElectranicsBaseProductRoutes = require("./routes/electranicsProduct.routes.js");
const productRoutes = require("./routes/product.routes.js");
const category = require("./routes/category.routes.js");

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://nex-basket-frontend.vercel.app",
];
const vercelPreviewPattern =
  /^https:\/\/nex-basket-frontend-[a-z0-9]+-bigbasketnex-1301s-projects\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        vercelPreviewPattern.test(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/store", storeRoutes)
app.use("/api/createElectranicsBaseProductRoutes", createElectranicsBaseProductRoutes)
app.use("/api/product", productRoutes);
app.use("/api/category", category);

app.listen(PORT, () => {
  connectDB().catch((err) => console.error("MongoDB connection error:", err.message));
  console.log(`Server is running on port ${PORT}`);
});