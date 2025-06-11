<template>
    <Menu v-if="faseAtual === 0" @start="iniciarFase" />

    <Game1 v-else-if="faseAtual === 1" :fase="faseAtual" :mostrarMenuInicial="true" @vencerNivel="faseAtual = 2"
        key="fase1" />
    <Game2 v-else-if="faseAtual === 2" :fase="faseAtual" :mostrarMenuInicial="false" @vencerNivel="faseAtual = 3"
        key="fase2" />
    <Game3 v-else-if="faseAtual === 3" :fase="faseAtual" :mostrarMenuInicial="false" @vencerNivel="faseAtual = 4"
        key="fase3" />
    <Game4 v-else-if="faseAtual === 4" :fase="faseAtual" :mostrarMenuInicial="false" @vencerNivel="faseAtual = 5"
        key="fase4" />
</template>

<script setup>
import { ref } from 'vue'
import Menu from './Menu.vue'
import Game1 from './Game1.vue'
import Game2 from './Game2.vue'
import Game3 from './Game3.vue'
import Game4 from './Game4.vue'

const faseAtual = ref(0) // começa no menu

function iniciarFase() {
    faseAtual.value = 1 // dispara a primeira fase e faz o menu desaparecer
}
</script>