import express from "express";
import auth from "./routes/auth.js"
import morgan from "morgan";
import createError from "http-errors";
import {} from "dotenv/config";
import "./helpers/init_mongodb.js";


const app = express();
app.use(morgan('dev'))
//to parse the request body if it is JSON
app.use(express.json())
//To parse the request body if it is a form
app.use(express.urlencoded({extended: true}))

app.use('/auth', auth)

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
app.listen(PORT, "localhost",() => {
    console.log(`Server is running on port ${PORT}`);
})


