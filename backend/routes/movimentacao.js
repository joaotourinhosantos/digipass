const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || "secreto", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post("/", autenticarToken, async (req, res) => {
  const { tipo, observacao } = req.body;
  const userID = req.user.id;

  if (!["entrada", "saida"].includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido" });
  }

  try {
    await pool.query(
      "INSERT INTO movimentacoes (userID, tipo, observacao) VALUES ($1, $2, $3)",
      [userID, tipo, observacao]
    );
    res.json({ msg: "Movimentação registrada" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar movimentação" });
  }
});

router.get("/", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM movimentacoes WHERE userID = $1 ORDER BY data DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar movimentações" });
  }
});

router.put("/:id", autenticarToken, async (req, res) => {
  const { tipo, observacao } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE movimentacoes SET tipo = $1, observacao = $2 WHERE id = $3 AND userID = $4",
      [tipo, observacao, id, req.user.id]
    );
    res.json({ msg: "Movimentação atualizada" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar movimentação" });
  }
});

router.delete("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM movimentacoes WHERE id = $1 AND userID = $2", [id, req.user.id]);
    res.json({ msg: "Movimentação removida" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar movimentação" });
  }
});

module.exports = router;
