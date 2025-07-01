const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secreto";

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

router.get("/perfil", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.email, p.nome, p.contato
       FROM usuarios u
       JOIN perfil p ON u.id = p.userid
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

router.put("/perfil", autenticarToken, async (req, res) => {
  const { nome, contato, foto } = req.body;

  try {
    const result = await pool.query(
      `UPDATE perfil SET nome = $1, contato = $2, foto = $3
       WHERE userid = $4`,
      [nome, contato, foto || null, req.user.id]
    );

    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;
