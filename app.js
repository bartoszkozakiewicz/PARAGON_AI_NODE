const express = require("express")
require('express-async-errors');
const bodyParser = require('body-parser');

const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productsRoutes")
const paragonRouter = require("./routes/paragonRoutes")
require('dotenv').config();
const cors = require("cors")

const app = express()

// Ustawianie konfiguracji CORS
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
  };

//other packages
const cookieParser = require("cookie-parser")


//Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");

// Increase payload limit to 50MB (adjust as needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors(corsOptions))




//Routers
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/paragon",paragonRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000 

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}...`)
})