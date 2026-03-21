// Emojis agrupados por temas
const temas = [
    ['🍎', '🍊', '🍋', '🍇', '🍓'],
    ['🐶', '🐱', '🐸', '🐧', '🐼'],
    ['⭐', '🌟', '💫', '✨', '🌙'],
    ['🚗', '🚕', '🚙', '🚌', '🏎'],
    ['🌸', '🌺', '🌻', '🌹', '🌷'],
    ['🍕', '🍔', '🌮', '🍩', '🧁'],
    ['⚽', '🏀', '🎾', '🏈', '🎱'],
];

// Cor de cada operacao
const coresOp = {
    '+': '#10b981',
    '-': '#f59e0b',
    '×': '#6366f1',
    '÷': '#ec4899'
};

const TOTAL_RODADAS = 10;

let pontos = 0;
let rodadaAtual = 1;
let respostaCorreta = null;
let bloqueado = false;
let operacaoAtual = null;

const canvas = document.getElementById('canvas-conta');
const ctx = canvas.getContext('2d');
const containerOpcoes = document.getElementById('container-opcoes');
const textoPontos = document.getElementById('pontos');
const textoRodada = document.getElementById('rodada-atual');
const telaSelecao = document.getElementById('tela-selecao');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');

function iniciarJogo(operacao) {
    operacaoAtual = operacao;
    pontos = 0;
    rodadaAtual = 1;
    textoPontos.innerText = 0;

    telaSelecao.style.display = 'none';
    telaJogo.style.display = 'block';
    telaFinal.style.display = 'none';

    iniciarRodada();
}

function voltarSelecao() {
    telaFinal.style.display = 'none';
    telaJogo.style.display = 'none';
    telaSelecao.style.display = 'block';
}

function reiniciarJogo() {
    pontos = 0;
    rodadaAtual = 1;
    textoPontos.innerText = 0;
    telaFinal.style.display = 'none';
    containerOpcoes.style.pointerEvents = 'auto';
    iniciarRodada();
}

function sortear(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarConta() {
    // Se for modo "todas", sorteia uma operacao aleatória
    const op = operacaoAtual === 'all'
        ? ['+', '-', '×', '÷'][sortear(0, 3)]
        : operacaoAtual;

    let a, b, resultado;

    if (op === '+') {
        a = sortear(1, 7);
        b = sortear(1, 7);
        resultado = a + b;
    } else if (op === '-') {
        a = sortear(3, 9);
        b = sortear(1, a - 1);
        resultado = a - b;
    } else if (op === '×') {
        a = sortear(2, 4);
        b = sortear(2, 4);
        resultado = a * b;
    } else {
        // Na divisao gera o resultado primeiro pra garantir que é exata
        resultado = sortear(2, 4);
        b = sortear(2, 4);
        a = resultado * b;
    }

    const temaAleatorio = temas[sortear(0, temas.length - 1)];
    const emoji = temaAleatorio[sortear(0, temaAleatorio.length - 1)];

    return { a, b, op, resultado, emoji };
}

function renderizarConta(conta) {
    const { a, b, op, emoji } = conta;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const maior = Math.max(a, b);
    const tamanho = maior <= 4 ? 50 : maior <= 6 ? 42 : 36;
    const colunas = 4;
    const espacamento = tamanho * 0.28;
    const alturaLabel = 44;
    const centroY = (H - alturaLabel) / 2;

    const cxEsquerda = W * 0.5 - W * 0.26;
    const cxDireita = W * 0.5 + W * 0.26;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    desenharGrupo(a, emoji, tamanho, espacamento, colunas, cxEsquerda, centroY);
    desenharGrupo(b, emoji, tamanho, espacamento, colunas, cxDireita, centroY);
    desenharNumero(a, cxEsquerda, H - alturaLabel / 2);
    desenharNumero(b, cxDireita, H - alturaLabel / 2);

    // Simbolo da operacao centralizado entre os dois grupos
    const tamanhoSimbolo = Math.max(38, Math.round(tamanho * 1.1));
    ctx.font = `bold ${tamanhoSimbolo}px 'Sora', sans-serif`;
    ctx.fillStyle = coresOp[op];
    ctx.shadowColor = coresOp[op];
    ctx.shadowBlur = 16;
    ctx.fillText(op, W / 2, centroY);
    ctx.shadowBlur = 0;
}

function desenharGrupo(n, emoji, tamanho, espacamento, maxColunas, cx, centroY) {
    const cols = Math.min(n, maxColunas);
    const linhas = Math.ceil(n / cols);
    const larguraCelula = tamanho + espacamento;
    const alturaCelula = tamanho + espacamento * 0.65;
    const alturaTotal = linhas * alturaCelula - espacamento * 0.65;
    const larguraTotal = cols * larguraCelula - espacamento;

    const inicioX = cx - larguraTotal / 2 + tamanho / 2;
    const inicioY = centroY - alturaTotal / 2 + tamanho / 2;

    ctx.font = `${tamanho}px serif`;
    for (let i = 0; i < n; i++) {
        const col = i % cols;
        const linha = Math.floor(i / cols);
        ctx.fillText(emoji, inicioX + col * larguraCelula, inicioY + linha * alturaCelula);
    }
}

function desenharNumero(n, cx, cy) {
    const texto = String(n);
    ctx.font = 'bold 22px \'Sora\', sans-serif';
    const larguraTexto = ctx.measureText(texto).width;
    const larguraPilula = larguraTexto + 28;
    const alturaPilula = 30;
    const px = cx - larguraPilula / 2;
    const py = cy - alturaPilula / 2;
    const raio = alturaPilula / 2;

    // Desenha a pílula laranja
    ctx.beginPath();
    ctx.moveTo(px + raio, py);
    ctx.lineTo(px + larguraPilula - raio, py);
    ctx.quadraticCurveTo(px + larguraPilula, py, px + larguraPilula, py + raio);
    ctx.lineTo(px + larguraPilula, py + alturaPilula - raio);
    ctx.quadraticCurveTo(px + larguraPilula, py + alturaPilula, px + larguraPilula - raio, py + alturaPilula);
    ctx.lineTo(px + raio, py + alturaPilula);
    ctx.quadraticCurveTo(px, py + alturaPilula, px, py + alturaPilula - raio);
    ctx.lineTo(px, py + raio);
    ctx.quadraticCurveTo(px, py, px + raio, py);
    ctx.closePath();

    ctx.fillStyle = 'rgba(47, 193, 10, 0.9)';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, cx, cy + 1);
}

function gerarOpcoes(correto) {
    const opcoes = new Set([correto]);

    // Gera alternativas próximas ao valor correto
    for (let i = 0; i < 30 && opcoes.size < 4; i++) {
        const candidato = correto + sortear(-5, 5);
        if (candidato > 0 && candidato !== correto) {
            opcoes.add(candidato);
        }
    }

    // Fallback caso nao tenha 4 opcoes ainda
    let n = 1;
    while (opcoes.size < 4) {
        if (!opcoes.has(n)) opcoes.add(n);
        n++;
    }

    return [...opcoes].sort(() => Math.random() - 0.5);
}

function iniciarRodada() {
    bloqueado = false;
    containerOpcoes.innerHTML = '';
    containerOpcoes.style.pointerEvents = 'auto';

    const conta = gerarConta();
    respostaCorreta = conta.resultado;
    textoRodada.innerText = rodadaAtual;

    renderizarConta(conta);

    gerarOpcoes(respostaCorreta).forEach(num => {
        const botao = document.createElement('button');
        botao.innerText = num;
        botao.className = 'matematica-btn';
        botao.onclick = () => checarResposta(num, botao);
        containerOpcoes.appendChild(botao);
    });
}

function checarResposta(escolha, botaoClicado) {
    if (bloqueado) return;
    bloqueado = true;
    containerOpcoes.style.pointerEvents = 'none';

    if (escolha === respostaCorreta) {
        pontos++;
        botaoClicado.classList.add('correct');
        tocarSomFeedback(true);
    } else {
        botaoClicado.classList.add('wrong');
        tocarSomFeedback(false);
        encontrarBotaoCorreto().classList.add('correct');
    }

    textoPontos.innerText = pontos;

    setTimeout(() => {
        if (rodadaAtual < TOTAL_RODADAS) {
            rodadaAtual++;
            containerOpcoes.style.pointerEvents = 'auto';
            iniciarRodada();
        } else {
            finalizarJogo();
        }
    }, 1500);
}

function encontrarBotaoCorreto() {
    const botoes = containerOpcoes.querySelectorAll('.matematica-btn');
    return Array.from(botoes).find(b => Number(b.innerText) === respostaCorreta);
}

function finalizarJogo() {
    document.getElementById('pontos-finais').innerText = pontos;
    telaFinal.style.display = 'flex';
}

function tocarSomFeedback(acertou) {
    // TODO: adicionar sons de feedback
    console.log(acertou ? 'Acertou!' : 'Errou!');
}

window.onload = iniciarRodada;