<template>
    <!-- Enquanto faseAtual for 0, exibe só o menu -->
    <Menu v-if="faseAtual === 0" @start="iniciarFase" />

    <!-- Depois que iniciarFase() for chamado, faseAtual vira 1 e o menu some -->
    <Game1 v-else-if="faseAtual === 1" @vencerNivel="faseAtual = 2" key="fase1" />
    <Game2 v-else-if="faseAtual === 2" @vencerNivel="faseAtual = 3" key="fase2" />
    <Game3 v-else-if="faseAtual === 3" @vencerNivel="faseAtual = 4" key="fase3" />
    <Game4 v-else-if="faseAtual === 4" @vencerNivel="faseAtual = 5" key="fase4" />
    <!-- e por aí vai… -->
</template>

<script setup>
import { ref } from 'vue'
import Menu from './Menu.vue'
import Game1 from './Game1.vue'
import Game2 from './Game2.vue'
import Game3 from './Game3.vue'
import Game4 from './Game4.vue'

const faseAtual = ref(0)   // começa no menu

function iniciarFase() {
    faseAtual.value = 1     // dispara a primeira fase e faz o menu desaparecer
}
</script>
