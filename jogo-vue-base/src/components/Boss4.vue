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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BossBase from './BossBase.vue'

const emit = defineEmits(['fire-power', 'update:x', 'update:y'])

// estado reativo da posição
const bossX = ref(79.8)
const bossY = ref(30)

// referência ao componente BossBase
const bossBaseRef = ref(null)

// identificadores de intervalo
let fireInterval = null
let teleportInterval = null

// repassa para fora quando o BossBase emite @update:x
function onUpdateX(x) {
  bossX.value = x
  emit('update:x', x)
}
function onUpdateY(y) {
  bossY.value = y
  emit('update:y', y)
}

// dispara os poderes periodicamente
function startFiring() {
  let contador = 0
  clearInterval(fireInterval)

  fireInterval = setInterval(() => {
    // dispara animação interna do BossBase
    const base = bossBaseRef.value
    if (base && typeof base.triggerAttack === 'function') {
      base.triggerAttack()
    }

    // prepara payload
    const frames = [
      '/fase4/poderhugo1.png',
      '/fase4/poderhugo2.png',
      '/fase4/poderhugo3.png',
      '/fase4/poderhugo4.png'
    ]
    const payloadBase = { frames, x: bossX.value, y: bossY.value }

    // a cada 8 ciclos dispara em três velocidades
    if (contador % 8 === 0) {
      emit('fire-power', { ...payloadBase, speed: 10 })
      emit('fire-power', { ...payloadBase, speed: 7  })
      emit('fire-power', { ...payloadBase, speed: 12 })
    } else {
      emit('fire-power', { ...payloadBase, speed: 2 })
    }

    contador++
  }, 1200)
}

// teleporta o boss para uma posição aleatória na tela
function startTeleporting() {
  clearInterval(teleportInterval)

  const larguraBoss = 10 // em porcentagem de largura — ajuste conforme seu layout
  const alturaBoss  = 10 // idem
  const margem      = 5  // margem interna

  const sfx = new Audio('/fase4/teleport.mp3')
  sfx.volume = 1.0

  teleportInterval = setInterval(() => {
    // calcula nova posição dentro dos limites [margem, 100 - larguraBoss - margem]
    const maxX = 100 - larguraBoss - margem
    const maxY = 100 - alturaBoss - margem
    const newX  = Math.random() * maxX + margem
    const newY  = Math.random() * maxY + margem

    // faz fade-out/fade-in no próprio <img> interno do BossBase
    const img = bossBaseRef.value?.getBossImg?.()?.value
    if (img) {
      img.style.transition = 'opacity 0.3s'
      img.style.opacity = '0'
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

    // toca efeito sonoro de teleporte
    sfx.currentTime = 0
    sfx.play().catch(()=>{})

  }, 3000)
}

onMounted(async () => {
  // garante que o template esteja renderizado
  await nextTick()

  // sempre rode após o BossBase carregar sua imagem
  const bossImgRef = bossBaseRef.value?.getBossImg?.()?.value
  if (bossImgRef) {
    if (bossImgRef.complete) {
      startFiring()
      startTeleporting()
    } else {
      bossImgRef.addEventListener('load', () => {
        startFiring()
        startTeleporting()
      })
    }
  } else {
    // fallback: inicia mesmo sem aguardar load
    startFiring()
    startTeleporting()
  }
})

onBeforeUnmount(() => {
  clearInterval(fireInterval)
  clearInterval(teleportInterval)
})
</script>

<style scoped>
.boss4 {
  position: absolute !important;
}
</style>
