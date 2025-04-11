
const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

const pagamentos = [];

app.get('/create_payment', (req, res) => {
  const { user_id, valor } = req.query;

  if (!user_id || !valor) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const payment_id = uuidv4();
  const novoPagamento = {
    payment_id,
    user_id,
    valor: parseFloat(valor),
    status: 'pending',
    data: new Date().toISOString()
  };

  pagamentos.push(novoPagamento);

  const qr_code_base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`;

  res.json({
    payment_id,
    qr_code_base64,
    qr_code: `PIXCODE-FAKE-${payment_id}`
  });
});

app.get('/check_payment', (req, res) => {
  const { payment_id } = req.query;

  const pag = pagamentos.find(p => p.payment_id === payment_id);

  if (!pag) return res.status(404).json({ status: "not_found" });

  const pago = new Date() - new Date(pag.data) > 15000;
  if (pago) pag.status = "paid";

  res.json({ status: pag.status });
});

app.get('/all_payments', (req, res) => {
  res.json(pagamentos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
