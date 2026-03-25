document.addEventListener('DOMContentLoaded', () => {
    // --- Efeito de scroll navbar ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        //Efeito de fundo
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        //Detectar direção do scroll, removê-lo ao descer a página e adicioná-lo novamente ao subir a página.

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hide');
        }
        else {
            header.classList.remove('hide');
        }
        lastScroll = currentScroll;

    }, { passive: true });



    //Avaliação dos jogos
    const jogos = document.querySelectorAll(".jogo-item");

    jogos.forEach(jogo => {
        const checkbox = jogo.querySelector(".check-jogo");
        const rating = jogo.querySelector(".rating");

        if (!checkbox || !rating) return;

        // Habilitar/desabilitar estrelas
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                rating.classList.remove("disabled");
            } else {
                rating.classList.add("disabled");
                const radios = rating.querySelectorAll("input[type='radio']");
                radios.forEach(radio => {
                    radio.checked = false;
                });
            }
        });


    });

    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {

        let erro = false;

        const jogos = document.querySelectorAll(".jogo-item");

        jogos.forEach(jogo => {
            const checkbox = jogo.querySelector(".check-jogo");
            const ratingSelecionado = jogo.querySelector(".rating input:checked");

            // Se marcou o jogo mas NÃO marcou estrela
            if (checkbox.checked && !ratingSelecionado) {
                erro = true;

                // Destaque visual
                jogo.classList.add("erro");
            } else {
                jogo.classList.remove("erro");
            }
        });

        if (erro) {
            e.preventDefault(); // Bloquear envio
            window.alert("⚠️ Avalie com estrelas todos os jogos selecionados.");
            return;
        }

        // se tudo ok
        alert("Respostas enviadas com sucesso! Muito obrigado pela sua colaboração!");
    });

});