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
    @fire-power="emit('fire-power', $event)" 
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
  dourada: { resposta: "p", imagem: "/fase4/perguntaDourada.png" },
};

const moedas = {
  bronze: [
    "/fase4/moedaBronze1.png",
    "/fase4/moedaBronze2.png",
    "/fase4/moedaBronze3.png",
    "/fase4/moedaBronze4.png",
  ],
  prata: [
    "/fase4/moedaPrata1.png",
    "/fase4/moedaPrata2.png",
    "/fase4/moedaPrata3.png",
    "/fase4/moedaPrata4.png",
  ],
  dourada: [
    "/fase4/moedaDourada1.png",
    "/fase4/moedaDourada2.png",
    "/fase4/moedaDourada3.png",
    "/fase4/moedaDourada4.png",
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
