<template>
    <div class="game-over-overlay">
        <div class="game-over-container">
            <img src="/imgGameOver.png" class="img-game-over" alt="Game Over" />
            <button class="btn-reiniciar" @click="$emit('restart')">
                REINICIAR
            </button>
        </div>
    </div>
</template>

<script setup>
// Emite evento 'restart' quando o botão for clicado
defineEmits(['restart']);
</script>

<style scoped>
.game-over-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.game-over-container {
    text-align: center;
}

.img-game-over {
    width: 100%;
    max-width: 62%;
    image-rendering: pixelated;
    pointer-events: none;
}

.btn-reiniciar {
    position: absolute;
    bottom: 38.8%;
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    background: red;
    color: white;
    padding: 16px 32px;
    border: 4px solid black;
    box-shadow: 4px 4px black;
    cursor: pointer;
    transition: transform 0.1s;
}

.btn-reiniciar:hover {
    transform: scale(1.05);
    background: rgb(100, 0, 0);
}
</style>