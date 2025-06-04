<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss4"
    @vencerNivel="$emit('vencerNivel')"
  />
</template>

<script setup>
import GameTemplate from "./GameTemplate.vue";
import Boss4 from "./Boss4.vue";

const emit = defineEmits(["vencerNivel"]);

const cenario = "/fase4/cenario4.png";
const musica = "/fase4/nivel4.mp3";
const bossVidaInicial = 7;
</script>
