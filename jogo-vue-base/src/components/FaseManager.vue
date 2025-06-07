<template>
    <Menu v-if="faseAtual === 0" @start="iniciarFase" />
    <Game1 v-else-if="faseAtual === 1" @vencerNivel="faseAtual = 2" />
    <Game2 v-else-if="faseAtual === 2" @vencerNivel="faseAtual = 3" />
    <Game3 v-else-if="faseAtual === 3" @vencerNivel="faseAtual = 4" />
    <Game4 v-else-if="faseAtual === 4" @vencerNivel="faseAtual = 1" />
</template>

<script setup>
import { ref } from 'vue'
import Menu from './Menu.vue'
import Game1 from './Game1.vue'
import Game2 from './Game2.vue'
import Game3 from './Game3.vue'
import Game4 from './Game4.vue'

const faseAtual = ref(0) // Começa no Menu
let faseIniciada = false // Evita que o menu volte após a primeira exibição

function iniciarFase() {
    if (!faseIniciada) {
        faseIniciada = true
        faseAtual.value = 1
    }
}
</script>
