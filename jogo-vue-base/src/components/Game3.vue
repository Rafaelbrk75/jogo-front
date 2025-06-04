<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss3"
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
</script>
