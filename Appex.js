const API_URL = 'https://appex-server.onrender.com';

// ── Elementos ──
const overlay     = document.getElementById('modalOverlay');
const modalBox    = document.getElementById('modalBox');
const btnAbrir    = document.getElementById('btnAbrirModal');
const btnFechar   = document.getElementById('btnFechar');
const btnConfirmar= document.getElementById('btnConfirmar');
const btnOlho     = document.getElementById('btnOlho');
const iconeOlho   = document.getElementById('iconeOlho');
const senhaInput  = document.getElementById('senhaInput');
const modalErro   = document.getElementById('modalErro');
const inputWrapper= document.getElementById('inputWrapper');

// ── Abrir modal ──
btnAbrir.addEventListener('click', () => {
  overlay.classList.add('ativo');
  senhaInput.focus();
  limparErro();
});

// ── Fechar ao clicar no X ──
btnFechar.addEventListener('click', fecharModal);

// ── Fechar ao clicar fora do card ──
overlay.addEventListener('click', (e) => {
  if (!modalBox.contains(e.target)) fecharModal();
});

// ── Enter no input ──
senhaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verificarSenha();
});

// ── Mostrar / esconder senha ──
btnOlho.addEventListener('click', () => {
  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    iconeOlho.className = 'fa-solid fa-eye-slash';
  } else {
    senhaInput.type = 'password';
    iconeOlho.className = 'fa-solid fa-eye';
  }
});

// ── Confirmar ──
btnConfirmar.addEventListener('click', verificarSenha);

// ── Funções ──
function fecharModal() {
  overlay.classList.remove('ativo');
  senhaInput.value = '';
  limparErro();
}

function mostrarErro(msg) {
  modalErro.textContent = msg;
  modalErro.style.display = 'block';
}

function limparErro() {
  modalErro.textContent = '';
  modalErro.style.display = 'none';
}

async function verificarSenha() {
  const senha = senhaInput.value.trim();

  if (!senha) {
    mostrarErro('Digite a senha para continuar.');
    return;
  }

  if (senha.length !== 10) {
    mostrarErro('A senha deve ter exatamente 10 caracteres.');
    return;
  }

  btnConfirmar.disabled = true;
  btnConfirmar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
  limparErro();

  try {
    const response = await fetch(`${API_URL}/verificar-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });

    const data = await response.json();

    if (response.ok && data.link) {
      btnConfirmar.innerHTML = '<i class="fa-solid fa-check"></i> Liberado!';
      btnConfirmar.style.background = 'linear-gradient(135deg, #10b981, #059669)';

      setTimeout(() => {
        window.location.href = data.link;
        fecharModal();
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = '<i class="fa-solid fa-unlock"></i> Liberar download';
        btnConfirmar.style.background = '';
      }, 800);

    } else {
      mostrarErro('Senha incorreta. Tente novamente.');
      senhaInput.value = '';
      senhaInput.focus();

      inputWrapper.classList.add('erro-shake');
      setTimeout(() => inputWrapper.classList.remove('erro-shake'), 500);

      btnConfirmar.disabled = false;
      btnConfirmar.innerHTML = '<i class="fa-solid fa-unlock"></i> Liberar download';
    }

  } catch (err) {
    mostrarErro('Erro de conexão. Tente novamente.');
    btnConfirmar.disabled = false;
    btnConfirmar.innerHTML = '<i class="fa-solid fa-unlock"></i> Liberar download';
  }
}