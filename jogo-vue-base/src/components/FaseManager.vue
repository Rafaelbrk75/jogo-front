<template>
    <component :is="componenteAtual" @vencerNivel="avancarNivel" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Game1 from './Game1.vue'
import Game2 from './Game2.vue'
import Game3 from './Game3.vue'
import Game4 from './Game4.vue'

const nivelAtual = ref(1)

const fases = {
    1: Game1,
    2: Game2,
    3: Game3,
    4: Game4
}

const componenteAtual = computed(() => fases[nivelAtual.value] || 'div')

function avancarNivel() {
    if (nivelAtual.value < 4) {
        nivelAtual.value++
    } else {
        alert("🏆 Você zerou o jogo!")
        nivelAtual.value = 1
    }
}
</script>
