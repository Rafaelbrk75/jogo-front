<template>
  <GameTemplate
    :fase="fase"
    :exibirMenu="false"
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss2"
    :perguntas="perguntas"
    :moedas="moedas"
    @tocarPlayer="levarDano"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss2 from "./Boss2.vue";

const props = defineProps({
  fase: { type: Number, required: true }
});

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase2/nivel2.jpg";
const musica = "/fase2/nivel2.mp3"; // ✅ Adicionada
const bossVidaInicial = 6;

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
