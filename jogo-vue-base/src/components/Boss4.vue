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
  const largura = 10, altura = 10, margem = 5
  const sfx = new Audio('/fase4/teleport.mp3')
  teleportInterval = setInterval(() => {
    const maxX = 100 - largura - margem
    const maxY = 100 - altura  - margem
    const newX = Math.random() * maxX + margem
    const newY = Math.random() * maxY + margem

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

