<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss2"
    :perguntas="perguntas"
    :moedas="moedas"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss2 from "./Boss2.vue";

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase2/nivel2.jpg";
const musica = "/fase2/nivel2.mp3";
const bossVidaInicial = 4;

// As perguntas e moedas são definidas diretamente no componente Game2
const perguntas = {
  bronze: { resposta: "5", imagem: "/fase2/imgPerguntaBronze.png" },
  prata: { resposta: "6", imagem: "/fase2/perguntaPrata.png" },
  dourada: { resposta: "y", imagem: "/fase2/perguntaDourada.png" },
};

// As moedas são definidas diretamente no componente Game2
const moedas = {
  bronze: [
    "/fase2/moedaBronze1.png",
    "/fase2/moedaBronze2.png",
    "/fase2/moedaBronze3.png",
  ],
  prata: [
    "/fase2/moedaPrata1.png",
    "/fase2/moedaPrata2.png",
    "/fase2/moedaPrata3.png",
  ],
  dourada: [
    "/fase2/moedaDourada1.png",
    "/fase2/moedaDourada2.png",
    "/fase2/moedaDourada3.png",
  ],
};
</script>
