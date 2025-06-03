<!-- Game2.vue -->
<template>
    <GameTemplate :bossVidaInicial="5" :cenario="'/nivel2.jpg'" :musica="'/nivel2.mp3'"
        @vencerNivel="$emit('vencerNivel')" />
</template>

<script setup>
import GameTemplate from './GameTemplate.vue'
</script>