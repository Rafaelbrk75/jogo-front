<template>
  <GameTemplate
    :fase="fase"           
    :exibirMenu="false"
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

// 1. RECEBER A PROP fase
const props = defineProps({
  fase: { type: Number, required: true }
});

// 2. PROPAGAR O EVENTO pro pai
const emit = defineEmits(["vencerNivel"]);

// ... suas constantes de cenário, áudio, perguntas, moedas

const cenario = "/fase3/cenario3.png";
const musica = "/fase3/nivel3.mp3";
const bossVidaInicial = 3;

// Perguntas
const perguntas = {
  bronze: { resposta: "7", imagem: "/fase3/imgPerguntaBronze.png" },
  prata: { resposta: "8", imagem: "/fase3/perguntaPrata.png" },
  dourada: { resposta: "x", imagem: "/fase3/perguntaDourada.png" },
};
// Moedas
const moedas = {
  bronze: ["/fase3/moedaBronze1.png", "/fase3/moedaBronze2.png", "/fase3/moedaBronze3.png"],
  prata: ["/fase3/moedaPrata1.png", "/fase3/moedaPrata2.png", "/fase3/moedaPrata3.png"],
  dourada: ["/fase3/moedaDourada1.png", "/fase3/moedaDourada2.png", "/fase3/moedaDourada3.png"],
};


</script>

