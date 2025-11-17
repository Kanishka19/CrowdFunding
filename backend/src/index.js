import express from "express";
import auth from "./routes/auth.js"
import paymentRoutes from "./routes/payment.js"
import blogRoutes from "./routes/blogs.js"
import profileRoutes from "./routes/profile.js"
import morgan from "morgan";
import createError from "http-errors";
import {} from "dotenv/config";
import "./helpers/init_mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import causesRoutes from "./routes/causesRoute.js"
import contactRoutes from "./routes/ContactRoutes.js";
import rateLimit from 'express-rate-limit';
import campaignOrgRoutes from "./routes/campaignOrgs.js";
import orgRegRoutes from "./routes/orgRegistration.js";
import { verifyJwtToken } from "./helpers/jwt.js";
import adminAPIRoutes from "./routes/adminAPIRoutes.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many attempts, please try again later'
});

const app = express();
app.disable('etag')
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
app.use(morgan('dev'))
//to parse the request body if it is JSON
app.use(express.json())
app.use(cookieParser())
//To parse the request body if it is a form
app.use(express.urlencoded({extended: true}))

app.use('/api/auth', auth)
app.use('/api/cause',causesRoutes);
app.use("/api/contact",contactRoutes);
app.use('/api/payment',verifyJwtToken,paymentRoutes)
app.use('/api/blogs',blogRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/org-campaign',campaignOrgRoutes)
app.use('/api/fileupload',orgRegRoutes)
app.use('/admin',adminAPIRoutes)
//Below functions to handle errors if route does not exist
app.use(async(req,res,next) => {
    next(createError.NotFound(`This route does not exist`));
})

app.use(async (err,req,res,next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 9000
app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})