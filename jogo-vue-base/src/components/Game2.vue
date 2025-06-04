<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss2"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss2 from "./Boss2.vue";

const emit = defineEmits(["vencerNivel"]);

const cenario = "//fase2/nivel2.jpg";
const musica = "/fase2/nivel2.mp3";
const bossVidaInicial = 4;
</script>
