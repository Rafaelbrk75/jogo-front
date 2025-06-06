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
const bossVidaInicial = 4;

// As perguntas e moedas são definidas diretamente no componente Game2
const perguntas = {
  bronze: { resposta: "p", imagem: "/fase2/imgPerguntaBronze.png" },
  prata: { resposta: "4", imagem: "/fase2/imgPerguntaPrata.png" },
  dourada: { resposta: "7", imagem: "/fase2/imgPerguntaDourada.png" },
};

// As moedas são definidas diretamente no componente Game2 ex
const moedas = {
  bronze: [
    "/fase2/moedaBronze1.png",
    "/fase2/moedaBronze2.png",
    "/fase2/moedaBronze3.png",
    "/fase2/moedaBronze4.png",
  ],
  prata: [
    "/fase2/moedaPrata1.png",
    "/fase2/moedaPrata2.png",
    "/fase2/moedaPrata3.png",
    "/fase2/moedaPrata4.png",
  ],
  dourada: [
    "/fase2/moedaDourada1.png",
    "/fase2/moedaDourada2.png",
    "/fase2/moedaDourada3.png",
    "/fase2/moedaDourada4.png",
  ],
};
</script>