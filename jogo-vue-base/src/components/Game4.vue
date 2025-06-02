<!-- Game4.vue -->
<template>
    <GameTemplate :bossVidaInicial="7" :cenario="'/cenario4.png'" :musica="'/nivel4.mp3'"
        @vencerNivel="$emit('vencerNivel')" />
</template>

<script setup>
import GameTemplate from './GameTemplate.vue'
</script>