const express = require("express")

const app = express();
app.use(express.json());


app.get("/user", (request, response) => {


    response.json({message: "Testando aplicação"})
})

const PORT = 3333;
app.listen(PORT, () => console.log(`Aplicação rodando na porta ${PORT}`))