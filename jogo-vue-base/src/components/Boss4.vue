<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    :initialY="bossY"
    src1="/fase4/boss.png"
    src2="/fase4/boss2.png"
    attackSrc="/fase4/bossatk.png"
    @update:x="onUpdateX"
    @update:y="onUpdateY"
    :class="['boss', 'boss4']"
    :style="{ top: bossY + '%', left: bossX + '%' }"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineExpose } from 'vue'
import BossBase from './BossBase.vue'

const emit = defineEmits(['fire-power','update:x','update:y'])

const bossX = ref(79.8)
const bossY = ref(30)
const bossBaseRef = ref(null)

let fireInterval = null
let teleportInterval = null

function onUpdateX(x) {
  bossX.value = x
  emit('update:x', x)
}
function onUpdateY(y) {
  bossY.value = y
  emit('update:y', y)
}

function startFiring() {
  let contador = 0
  clearInterval(fireInterval)
  fireInterval = setInterval(() => {
    bossBaseRef.value?.triggerAttack()
    const frames = [
      '/fase4/poderhugo1.png',
      '/fase4/poderhugo2.png',
      '/fase4/poderhugo3.png',
      '/fase4/poderhugo4.png'
    ]
    const payload = { frames, x: bossX.value, y: bossY.value }
    if (contador % 8 === 0) {
      emit('fire-power', { ...payload, speed: 10 })
      emit('fire-power', { ...payload, speed: 7  })
      emit('fire-power', { ...payload, speed: 12 })
    } else {
      emit('fire-power', { ...payload, speed: 2 })
    }
    contador++
  }, 1200)
}

function startTeleporting() {
  clearInterval(teleportInterval)

  const larguraBoss = 10 // em porcentagem de largura — ajuste conforme seu layout
  const alturaBoss  = 10 // idem
  const margem      = 5  // margem interna
  const margemTop = 5;
  const margemBottom = 15; // Exemplo: para evitar que vá muito pra baixo
  const margemLeft = 5;
  const margemRight = 5;

  teleportInterval = setInterval(() => {
    // calcula nova posição dentro dos limites [margem, 100 - larguraBoss - margem]
    const maxX = 100 - larguraBoss - margemRight;
const maxY = 100 - alturaBoss - margemBottom; // Usando margemBottom aqui

const newX  = Math.random() * (maxX - margemLeft) + margemLeft; // Ajusta o inicio tbm
const newY  = Math.random() * (maxY - margemTop) + margemTop;   // Ajusta o inicio tbm

    const img = bossBaseRef.value?.getBossImg?.()?.value
    if (img) {
      img.style.transition = 'opacity 0.3s'
      img.style.opacity    = '0'
      setTimeout(() => {
        bossX.value = newX
        bossY.value = newY
        emit('update:x', newX)
        emit('update:y', newY)
        img.style.opacity = '1'
      }, 300)
    } else {
      bossX.value = newX
      bossY.value = newY
      emit('update:x', newX)
      emit('update:y', newY)
    }

    sfx.currentTime = 0
    sfx.play().catch(() => {})
  }, 3000)
}

// Método para parar ambos os intervals (se o pai precisar)
function stop() {
  clearInterval(fireInterval)
  clearInterval(teleportInterval)
}

onMounted(async () => {
  await nextTick()
  const img = bossBaseRef.value?.getBossImg?.()?.value
  if (img) {
    if (img.complete) {
      startFiring()
      startTeleporting()
    } else {
      img.addEventListener('load', () => {
        startFiring()
        startTeleporting()
      })
    }
  } else {
    startFiring()
    startTeleporting()
  }
})

onBeforeUnmount(() => {
  clearInterval(fireInterval)
  clearInterval(teleportInterval)
})

// Exponha apenas o stop(), já que triggerAttack pertence ao BossBase
defineExpose({ stop })
</script>

