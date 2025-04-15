
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./pagamentos.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pagamentos (
    id TEXT PRIMARY KEY,
    valor REAL,
    status TEXT,
    data_pagamento TEXT,
    usuario TEXT
  )`);
});

app.post('/pushinpay/webhook', (req, res) => {
  const { id, status, value, created_at } = req.body;
  const usuario = req.query.usuario || 'desconhecido';

  if (status === 'paid') {
    const valor = value / 100;
    const data = created_at || new Date().toISOString();

    const stmt = db.prepare('INSERT OR IGNORE INTO pagamentos (id, valor, status, data_pagamento, usuario) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, valor, status, data, usuario, (err) => {
      if (err) {
        console.error("Erro ao salvar no banco:", err.message);
      } else {
        console.log("Pagamento salvo:", id, usuario);
      }
    });
    stmt.finalize();
  }

  res.sendStatus(200);
});

app.get('/pagamentos', (req, res) => {
  db.all('SELECT * FROM pagamentos ORDER BY data_pagamento DESC', (err, rows) => {
    if (err) {
      console.error("Erro ao consultar o banco:", err.message);
      return res.status(500).send("Erro interno");
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
