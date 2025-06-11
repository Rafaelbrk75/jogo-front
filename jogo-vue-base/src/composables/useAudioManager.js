import { ref } from "vue";

export function useAudioManager() {
    const audios = ref({});

    function registerAudio(key, element) {
        audios.value[key] = element;
    }

    function play(key, loop = false) {
        const audio = audios.value[key];
        if (audio) {
            audio.loop = loop;
            audio.currentTime = 0;
            audio.play().catch(() => { });
        }
    }

    function pause(key) {
        const audio = audios.value[key];
        if (audio) {
            audio.pause();
        }
    }

    function stop(key) {
        const audio = audios.value[key];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    function pauseAll() {
        Object.values(audios.value).forEach((audio) => audio && audio.pause());
    }

    function stopAll() {
        Object.values(audios.value).forEach((audio) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    return {
        registerAudio,
        play,
        pause,
        stop,
        pauseAll,
        stopAll,
        audios,
    };
}