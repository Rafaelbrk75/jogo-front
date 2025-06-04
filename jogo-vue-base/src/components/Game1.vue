<template>
  <GameTemplate
    :cenario="cenario"
    :musica="musica"
    :bossVidaInicial="bossVidaInicial"
    :bossComponent="Boss1"
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
</script>
