let pontos = 0;
let rodadaAtual = 1;
const totalRodadas = 10;
let animalCorreto = "";
let audioAtual = null;

const todosAnimais = [
    "cachorro", "gato", "vaca", "porco", "cabra", 
    "cavalo", "pato", "leao", "elefante", "macaco"
];

const textoPontos = document.getElementById("pontos-texto");
const textoRodada = document.getElementById("rodada-atual");
const containerCards = document.getElementById("cards-container");
const telaFinal = document.getElementById("tela-final");
const pontosFinais = document.getElementById("pontos-finais");

iniciarNovaRodada();

function iniciarNovaRodada() {
  
    textoRodada.innerText = rodadaAtual;
    containerCards.innerHTML = ""; 

    
    // sorteio
    const animaisSorteados = todosAnimais.sort(() => 0.5 - Math.random()).slice(0, 5);
    const indiceCorreto = Math.floor(Math.random() * 5);
    animalCorreto = animaisSorteados[indiceCorreto];

    //Carrega o áudio na memória
    audioAtual = new Audio(`../../assets/sons/${animalCorreto}.mp3`);

    animaisSorteados.forEach(animal => {
        const btn = document.createElement("button");
        btn.className = "animal-card";
        // Quando clicar, chama a função de verificação
        btn.onclick = () => verificarResposta(animal, btn); 

        // Adiciona a imagem e o nome
        btn.innerHTML = `
            <img src="../../assets/imagens/jogo_sons/${animal}.png" alt="Desenho de um ${animal}">
            <h3>${animal}</h3>
        `;
        
        containerCards.appendChild(btn);
    });
}

function tocarSom() {
    if (audioAtual) {
        audioAtual.play();
    }
}

function verificarResposta(animalEscolhido, botaoClicado) {
 
    containerCards.style.pointerEvents = "none"; 

    if (animalEscolhido === animalCorreto) {
        pontos++;
        textoPontos.innerText = pontos;
        botaoClicado.classList.add("acertou"); 
    } else {
        botaoClicado.classList.add("errou"); 
    }

    // Espera 1 segundo
    setTimeout(() => {
        if (rodadaAtual < totalRodadas) {
            rodadaAtual++;
            containerCards.style.pointerEvents = "auto"; // Libera o clique :)
            iniciarNovaRodada();
        } else {
            finalizarJogo();
        }
    }, 1000); 
}

function finalizarJogo() {
    telaFinal.style.display = "flex";
    pontosFinais.innerText = pontos;
}

function reiniciarJogo() {
    pontos = 0;
    rodadaAtual = 1;
    textoPontos.innerText = pontos;
    telaFinal.style.display = "none";
    containerCards.style.pointerEvents = "auto";
    iniciarNovaRodada();
}