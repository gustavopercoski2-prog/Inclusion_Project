const cartas = [
    { nome: "Caderno", img: "/assets/imagens/jogo_memoria/Caderno.png" },
    { nome: "Dado", img: "/assets/imagens/jogo_memoria/Dado.png" },
    { nome: "Lápis", img: "/assets/imagens/jogo_memoria/Lapis.png" },
    { nome: "Macaco", img: "/assets/imagens/jogo_memoria/Macaco.png" },
    { nome: "Microscópio", img: "/assets/imagens/jogo_memoria/Microscopio.png" },
    { nome: "Tartaruga", img: "/assets/imagens/jogo_memoria/Tartaruga.png" },
];

const VERSO_IMG = "/assets/imagens/jogo_memoria/Cerebro.png";

let cartaVirada = false;
let travado = false;
let primeiraCartaSelecionada = null;
let segundaCartaSelecionada = null;
let paresAcertados = 0;
let tentativas = 0;
let tempoInicio = null;

// Monta preview na tela inicial
const gradePreview = document.getElementById('grade-preview');
cartas.forEach(c => {
    gradePreview.innerHTML += `
        <div class="card-preview">
            <img src="${c.img}" alt="${c.nome}">
            <span>${c.nome}</span>
        </div>`;
});

function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('active'));
    if (id) document.getElementById(id).classList.add('active');
}

function iniciarJogo() {
    cartaVirada = false;
    travado = true;
    primeiraCartaSelecionada = null;
    segundaCartaSelecionada = null;
    paresAcertados = 0;
    tentativas = 0;
    atualizarPlacar();
    montarTabuleiro();
    mostrarTela('tela-contagem');
    iniciarContagem();
}

function montarTabuleiro() {
    const grade = document.getElementById('grade-cartas');
    grade.innerHTML = '';

    // Duplica e embaralha
    const baralho = [...cartas, ...cartas]
        .map(c => ({ ...c, _ordem: Math.random() }))
        .sort((a, b) => a._ordem - b._ordem);

    baralho.forEach(c => {
        const carta = document.createElement('div');
        carta.className = 'carta virada'; // Comeca mostrando a frente pro peek
        carta.dataset.nome = c.nome;
        carta.innerHTML = `
            <div class="frente">
                <img src="${c.img}" alt="${c.nome}">
                <span class="nome-carta">${c.nome}</span>
            </div>
            <div class="verso">
                <img src="${VERSO_IMG}" alt="Verso">
            </div>`;
        grade.appendChild(carta);
    });
}

function iniciarContagem() {
    const numEl = document.getElementById('numero-contagem');
    let segundos = 5;
    numEl.textContent = segundos;

    const timer = setInterval(() => {
        segundos--;
        if (segundos <= 0) {
            clearInterval(timer);
            esconderCartas();
        } else {
            numEl.textContent = segundos;
        }
    }, 1000);
}

function esconderCartas() {
    mostrarTela(null);
    const todasCartas = getCartas();

    requestAnimationFrame(() => {
        todasCartas.forEach(c => c.classList.remove('virada'));

        // Espera a animacao terminar pra liberar o clique
        setTimeout(() => {
            travado = false;
            todasCartas.forEach(c => c.addEventListener('click', virarCarta));
            tempoInicio = Date.now();
        }, 600);
    });
}

function getCartas() {
    return Array.from(document.querySelectorAll('.carta'));
}

function virarCarta() {
    if (travado) return;
    if (this === primeiraCartaSelecionada) return;
    if (this.classList.contains('acertada')) return;

    this.classList.add('virada');

    if (!cartaVirada) {
        cartaVirada = true;
        primeiraCartaSelecionada = this;
        return;
    }

    segundaCartaSelecionada = this;
    tentativas++;
    atualizarPlacar();
    checarPar();
}

function checarPar() {
    const acertou = primeiraCartaSelecionada.dataset.nome === segundaCartaSelecionada.dataset.nome;
    acertou ? parAcertado() : parErrado();
}

function parAcertado() {
    primeiraCartaSelecionada.removeEventListener('click', virarCarta);
    segundaCartaSelecionada.removeEventListener('click', virarCarta);
    primeiraCartaSelecionada.classList.add('acertada');
    segundaCartaSelecionada.classList.add('acertada');

    paresAcertados++;
    atualizarPlacar();

    if (paresAcertados === cartas.length) {
        setTimeout(finalizarJogo, 700);
    }

    resetar();
}

function parErrado() {
    travado = true;
    document.getElementById('instrucao').textContent = 'Ops! Tente de novo 🙈';

    setTimeout(() => {
        primeiraCartaSelecionada.classList.remove('virada');
        segundaCartaSelecionada.classList.remove('virada');
        document.getElementById('instrucao').textContent = 'Encontre todos os pares!';
        resetar();
    }, 1200);
}

function resetar() {
    [cartaVirada, travado] = [false, false];
    [primeiraCartaSelecionada, segundaCartaSelecionada] = [null, null];
}

function atualizarPlacar() {
    document.getElementById('contador-tentativas').textContent = tentativas;
    document.getElementById('contador-pares').textContent = paresAcertados;
}

function finalizarJogo() {
    const tempo = Math.round((Date.now() - tempoInicio) / 1000);
    document.getElementById('total-tentativas').textContent = tentativas;
    document.getElementById('tempo-final').textContent = tempo + 's';
    mostrarTela('tela-fim');
}