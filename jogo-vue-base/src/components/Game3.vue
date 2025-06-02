<!-- Game3.vue -->
<template>
    <GameTemplate :bossVidaInicial="7" :cenario="'/cenario3.png'" :musica="'/nivel3.mp3'"
        @vencerNivel="$emit('vencerNivel')" />
</template>

<script setup>
import GameTemplate from './GameTemplate.vue'
</script>