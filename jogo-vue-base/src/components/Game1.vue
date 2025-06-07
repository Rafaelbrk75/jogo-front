<template>
  <GameTemplate
    :exibirMenu="true"
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss1"
    :perguntas="perguntas"
    :moedas="moedas"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss1 from "./Boss1.vue";

// declara que este componente também emite “vencerNivel”
const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase1/cenario1.png";
const musica = "/fase1/nivel1.mp3";
const bossVidaInicial = 3;

const perguntas = {
  bronze: { resposta: "7", imagem: "/fase1/imgPerguntaBronze.png" },
  prata: { resposta: "8", imagem: "/fase1/perguntaPrata.png" },
  dourada: { resposta: "x", imagem: "/fase1/perguntaDourada.png" },
};

const moedas = {
  bronze: [
    "/moedaBronze1.png",
    "/moedaBronze2.png",
    "/moedaBronze3.png",
    "/moedaBronze4.png",
  ],
  prata: [
    "/moedaPrata1.png",
    "/moedaPrata2.png",
    "/moedaPrata3.png",
    "/moedaPrata4.png",
  ],
  dourada: [
    "/moedaDourada1.png",
    "/moedaDourada2.png",
    "/moedaDourada3.png",
    "/moedaDourada4.png",
  ],
};
</script>
