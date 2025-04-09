const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const API_URL = 'http://caospay.shop:5555';

app.use(cors());
app.use(express.json());

// Cria pagamento via proxy
app.get('/create_payment', async (req, res) => {
  const { user_id, valor } = req.query;

  if (!user_id || !valor) {
    return res.status(400).json({ error: 'Parâmetros ausentes.' });
  }

  try {
    const resposta = await fetch(`${API_URL}/create_payment?user_id=${user_id}&valor=${valor}`);
    const dados = await resposta.json();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao criar pagamento:', err);
    res.status(500).json({ error: 'Erro ao criar pagamento via proxy.' });
  }
});

// Verifica pagamento via proxy
app.get('/check_payment', async (req, res) => {
  const { user_id, payment_id } = req.query;

  if (!user_id || !payment_id) {
    return res.status(400).json({ error: 'Parâmetros ausentes.' });
  }

  try {
    const resposta = await fetch(`${API_URL}/check_payment?user_id=${user_id}&payment_id=${payment_id}`);
    const dados = await resposta.json();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao verificar pagamento:', err);
    res.status(500).json({ error: 'Erro ao verificar pagamento via proxy.' });
  }
});

app.get('/', (req, res) => {
  res.send('🟢 Proxy CaosPay está online. Use /create_payment e /check_payment');
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
