<template>
  <GameTemplate
    :fase="fase"
    :exibirMenu="false"
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss4"
    :perguntas="perguntas"
    :moedas="moedas"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss4 from "./Boss4.vue";

const props = defineProps({
  fase: { type: Number, required: true }
});

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase4/cenario4.png";
const musica = "/fase4/nivel4.mp3";
const bossVidaInicial = 7;

// As perguntas e moedas são definidas diretamente no componente Game4
const perguntas = {
  bronze:  { resposta: "h", imagem: "/fase4/imgPerguntaBronze.png" },
  prata:   { resposta: "g", imagem: "/fase4/perguntaPrata.png" },
  dourada: { resposta: "a", imagem: "/fase4/perguntaDourada.png" },
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

function limparJogo() {
  console.log("🧹 limpando jogo na fase 2...");

  // Remove listeners adicionados no GameTemplate
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);

  // Cancela animações e timers do jogo, se algum estiver ativo
  cancelAnimationFrame(window.frameLoopId || 0);
  clearInterval(window.moedaAnimacaoId || 0);
  clearInterval(window.animacaoPrataId || 0);
  clearInterval(window.animacaoDouradaId || 0);
  clearInterval(window.timerPerguntaId || 0);
}

// Garante que a limpeza seja feita ao sair da fase



</script>
