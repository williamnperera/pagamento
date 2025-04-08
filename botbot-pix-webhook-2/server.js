
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

// Produtos fixos com preços
const produtos = {
  camiseta: 50,
  caneca: 30,
  adesivo: 10
};

// ID do dono da conta no CaosPay
const userId = 1018180562;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const nomeProduto = (req.body.produto || '').toLowerCase();

  if (!produtos[nomeProduto]) {
    return res.json({ mensagem: `❌ Produto "${nomeProduto}" não encontrado.` });
  }

  const valorTotal = produtos[nomeProduto];
  const valorApi = valorTotal - 1;

  try {
    const resposta = await fetch(`http://caospay.shop:5555/create_payment?user_id=${userId}&valor=${valorApi}`);
    const dados = await resposta.json();

    const mensagem = `🛒 Produto: ${nomeProduto.toUpperCase()}
💰 Valor total: R$ ${valorTotal},00

📲 Escaneie o QR Code abaixo para pagar ou copie o código Pix:

🔢 Código PIX:
${dados.qr_code}

Assim que o pagamento for confirmado, seu pedido será processado.`;

    res.json({
      imagem: dados.qr_code_base64,
      mensagem
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao gerar pagamento." });
  }
});

app.listen(PORT, () => {
  console.log(`Webhook rodando em http://localhost:${PORT}`);
});
