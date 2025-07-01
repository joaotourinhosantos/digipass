const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const movimentacaoRoutes = require("./routes/movimentacao");
app.use("/movimentacoes", movimentacaoRoutes);

const usuarioRoutes = require("./routes/usuarios");
app.use("/usuarios", usuarioRoutes);






