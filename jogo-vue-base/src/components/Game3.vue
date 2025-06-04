<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss3"
    :perguntas="perguntas"
    :moedas="moedas"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss3 from "./Boss3.vue";    

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase3/cenario3.png";
const musica = "/fase3/nivel3.mp3";
const bossVidaInicial = 5;

// As perguntas e moedas são definidas diretamente no componente Game3
const perguntas = { 
  bronze: { resposta: "3", imagem: "/fase3/imgPerguntaBronze.png" },
  prata: { resposta: "4", imagem: "/fase3/perguntaPrata.png" },
  dourada: { resposta: "z", imagem: "/fase3/perguntaDourada.png" },
};

const moedas = {
  bronze: [
    "/fase3/moedaBronze1.png",
    "/fase3/moedaBronze2.png",
    "/fase3/moedaBronze3.png",
  ],
  prata: [
    "/fase3/moedaPrata1.png",
    "/fase3/moedaPrata2.png",
    "/fase3/moedaPrata3.png",
  ],
  dourada: [
    "/fase3/moedaDourada1.png",
    "/fase3/moedaDourada2.png",
    "/fase3/moedaDourada3.png",
  ],
};

</script>
