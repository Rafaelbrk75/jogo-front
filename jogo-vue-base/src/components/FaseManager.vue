<template>
  <Game1 v-if="faseAtual === 1" @vencerNivel="faseAtual = 2" />
  <Game2 v-else-if="faseAtual === 2" @vencerNivel="faseAtual = 3" />
  <Game3 v-else-if="faseAtual === 3" @vencerNivel="faseAtual = 4" />
  <Game4 v-else-if="faseAtual === 4" @vencerNivel="faseAtual = 1" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Game1 from './Game1.vue'
import Game2 from './Game2.vue'
import Game3 from './Game3.vue'
import Game4 from './Game4.vue'

const nivelAtual = ref(1)
const faseAtual = ref(1); // ou o valor inicial desejado

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
