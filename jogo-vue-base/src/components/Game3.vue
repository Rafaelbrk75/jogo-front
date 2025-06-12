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
const bossVidaInicial = 8;

// Perguntas
const perguntas = {
  bronze: { resposta: "b", imagem: "/fase3/imgPerguntaBronze.png" },
  prata: { resposta: "c", imagem: "/fase3/perguntaPrata.png" },
  dourada: { resposta: "c", imagem: "/fase3/perguntaDourada.png" },
};
// Moedas
const moedas = {
  bronze: ["/moedaBronze1.png", "/moedaBronze2.png", "/moedaBronze3.png"],
  prata: ["/moedaPrata1.png", "/moedaPrata2.png", "/moedaPrata3.png"],
  dourada: ["/moedaDourada1.png", "/moedaDourada2.png", "/moedaDourada3.png"],
};


</script>

