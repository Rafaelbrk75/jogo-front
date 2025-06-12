<template>
  <div class="tela-final">
    <video
      ref="videoRef"
      src="/video-final.mp4"
      playsinline
      class="video-final"
      @ended="$emit('voltarMenu')"
    />
    <button v-if="mostrarBotao" class="btn-som" @click="tocarComSom">
      INICIAR COM SOM
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const videoRef = ref(null);
const mostrarBotao = ref(true);

function tocarComSom() {
  if (videoRef.value) {
    videoRef.value.muted = false;
    videoRef.value.play();
    mostrarBotao.value = false;
  }
}
</script>

<style scoped>
.tela-final {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.video-final {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

.btn-som {
  position: absolute;
  bottom: 40px;
  font-family: 'Press Start 2P', monospace;
  padding: 16px 32px;
  font-size: 14px;
  background: red;
  color: white;
  border: 4px solid black;
  box-shadow: 4px 4px black;
  cursor: pointer;
}
</style>