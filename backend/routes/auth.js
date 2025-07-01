const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "secreto";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.senha);

    if (!isValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
    const token = jwt.sign({ id: user.id, tipoUsuario: 1 }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro ao autenticar:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get("/protegido", autenticarToken, (req, res) => {
  res.json({ mensagem: `Acesso concedido ao usuário ${req.user.id}` });
});

router.post("/registro", async (req, res) => {
  const { email, senha, nome, contato } = req.body;

  try {
    const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "Email já registrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, senha, tipousuario, mudaSenha, liberado)
       VALUES ($1, $2, 1, false, true)
       RETURNING id`,
      [email, senhaHash]
    );

    const userID = result.rows[0].id;

    await pool.query(
      `INSERT INTO perfil (userID, nome, contato, foto)
       VALUES ($1, $2, $3, NULL)`,
      [userID, nome, contato]
    );

    res.status(201).json({ mensagem: "Usuário registrado com sucesso." });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

module.exports = router;
