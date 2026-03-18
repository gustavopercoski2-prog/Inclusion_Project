const TODAS_EMOCOES = [
    { nome: 'Cansaço', arquivo: 'cansaco.png' },
    { nome: 'Dúvida', arquivo: 'duvida.png' },
    { nome: 'Espanto', arquivo: 'espanto.png' },
    { nome: 'Felicidade', arquivo: 'felicidade.png' },
    { nome: 'Medo', arquivo: 'medo.png' },
    { nome: 'Neutro', arquivo: 'neutro.png' },
    { nome: 'Nojo', arquivo: 'nojo.png' },
    { nome: 'Raiva', arquivo: 'odio.png' },
    { nome: 'Tristeza', arquivo: 'tristeza.png' },
    { nome: 'Vergonha', arquivo: 'vergonha.png' }
];

let pontos = 0;
let rodadaAtual = 1;
let emocaoCorreta = null;
const TOTAL_RODADAS = 10;

const imgPergunta = document.getElementById('imagem-pergunta');
const containerOpcoes = document.getElementById('container-opcoes');
const textoPontos = document.getElementById('pontos');
const textoRodada = document.getElementById('rodada-atual');
const telaFinal = document.getElementById('tela-final');
const textoPontosFinais = document.getElementById('pontos-finais');

function iniciarRodada() {
    containerOpcoes.innerHTML = '';

    const indiceAleatorio = Math.floor(Math.random() * TODAS_EMOCOES.length);
    emocaoCorreta = TODAS_EMOCOES[indiceAleatorio];

    imgPergunta.src = `../../assets/imagens/jogo_emocoes/${emocaoCorreta.arquivo}`;
    imgPergunta.alt = `Como este personagem está se sentindo?`;
    
    textoRodada.innerText = rodadaAtual;

    const opcoesParaBotoes = gerarOpcoes(emocaoCorreta);

    opcoesParaBotoes.forEach(emocao => {
        const botao = document.createElement('button');
        botao.innerText = emocao.nome;
        botao.className = 'emotion-btn';
        botao.onclick = () => checarResposta(emocao.nome, botao);
        containerOpcoes.appendChild(botao);
    });
}


function gerarOpcoes(correta) {
 
    const outrasEmocoes = TODAS_EMOCOES.filter(e => e.nome !== correta.nome);
    
    const erradasSorteadas = outrasEmocoes
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    return [...erradasSorteadas, correta].sort(() => Math.random() - 0.5);
}

function checarResposta(nomeEscolhido, botaoClicado) {
    containerOpcoes.style.pointerEvents = 'none';

    if (nomeEscolhido === emocaoCorreta.nome) {
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
    const botoes = containerOpcoes.querySelectorAll('.emotion-btn');
    return Array.from(botoes).find(b => b.innerText === emocaoCorreta.nome);
}

function finalizarJogo() {
    document.getElementById('pontos-finais').innerText = pontos;
    
    const tela = document.getElementById('tela-final');
    tela.style.display = 'flex';
}

function reiniciarJogo() {
    pontos = 0;
    rodadaAtual = 1;
    textoPontos.innerText = pontos;
    telaFinal.style.display = 'none';
    containerOpcoes.style.pointerEvents = 'auto';
    iniciarRodada();
}

function tocarSomFeedback(acertou) {
    console.log(acertou ? "Acertou!" : "Errou!");
}

window.onload = iniciarRodada;