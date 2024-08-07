import mongoose from "mongoose"

mongoose.connect(process.env.MONGO_URL,
{
    "dbName": process.env.DB_NAME
})
.then(() => {
    console.log('mongodb connected')
})
.catch((err) => {
    console.log(err.message)
})

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB")
})
mongoose.connection.on("error", (err) => {
    console.log(err.message)
})
mongoose.connection.on("Disconnected", () => {
    console.log("Mongoose connection is disconnected")
})

process.on("SIGINT", async() => {
    mongoose.connection.close();
    process.exit(0);
})