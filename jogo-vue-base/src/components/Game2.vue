<template>
  <GameTemplate
    :exibirMenu="false"
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss2"
    :perguntas="perguntas"
    :moedas="moedas"
    :fase="2"
    @tocarPlayer="levarDano"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss2 from "./Boss2.vue";

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase2/nivel2.jpg";
const musica = "/fase2/nivel2.mp3"; // ✅ Adicionada
const bossVidaInicial = 4;

// ✅ Função levarDano fictícia (você pode alterar conforme sua lógica real)
function levarDano() {
  console.log("Jogador levou dano na fase 2");
  // Aqui você pode emitir eventos, manipular vidas, etc.
}

// ✅ Perguntas
const perguntas = {
  bronze: { resposta: "p", imagem: "/fase2/imgPerguntaBronze.png" },
  prata: { resposta: "4", imagem: "/fase2/imgPerguntaPrata.png" },
  dourada: { resposta: "7", imagem: "/fase2/imgPerguntaDourada.png" },
};

// ✅ Moedas
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
