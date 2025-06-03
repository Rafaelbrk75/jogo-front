<!-- Game1.vue -->
<template>
  <GameTemplate :bossVidaInicial="3" :cenario="'/cenario1.png'" :musica="'/nivel1.mp3'"
:bossSrc="'/bossMoreno.png'" @vencerNivel="$emit('vencerNivel')" />
</template>

<script setup>
import GameTemplate from './GameTemplate.vue'
</script>








