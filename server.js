const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SENHA_CORRETA = 'X8=5tfh7!1';

const LINK_DOWNLOAD = "https://github.com/Fredson-Sy/Appex/releases/download/v0.6.0-beta/ByteControl.Setup.0.6.0-Beta.exe";

app.use(cors({
  origin: [
    'https://fredson-sy.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ]
}));

app.use(express.json());

app.post('/verificar-senha', (req, res) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ erro: 'Senha não informada.' });
  }

  if (senha === SENHA_CORRETA) {
    return res.status(200).json({ link: LINK_DOWNLOAD });
  } else {
    return res.status(401).json({ erro: 'Senha incorreta.' });
  }
});

// Rota: health check (Render usa para saber se o servidor está vivo)
app.get('/', (req, res) => {
  res.json({ status: 'Appex server online 🚀' });
});

app.listen(PORT, () => {
  console.log(`Servidor Appex rodando na porta ${PORT}`);
});