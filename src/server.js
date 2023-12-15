require("express-async-errors");
require("dotenv");
const express = require("express");
const AppError = require("./utils/AppError");
const database = require("./database/sqlite")
const uploadsconfig = require("./configs/dishUploads")
const cookieParser = require("cookie-parser")
const  cors = require("cors")

const routes = require("./routes")

const app = express();
app.use(express.json());
app.use(cookieParser());
database();

app.use("/files", express.static(uploadsconfig.UPLOADS_FOLDER));
app.use(cors({
    origin: [process.env.DOMAIN, "http://127.0.0.1:5173/"],
    credentials: true,
}));
app.use(routes);


app.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });

    };

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
   
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Aplicação rodando na porta ${PORT}`))