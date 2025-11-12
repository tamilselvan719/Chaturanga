
type SoundType = 'move' | 'capture' | 'check' | 'game-over';

const soundsData: { [key in SoundType]: string } = {
    move: '/assets/move.wav',
    capture: '/assets/capture.wav',
    check: '/assets/check.wav',
    'game-over': '/assets/game-over.wav'
};

const audioElements: { [key in SoundType]?: HTMLAudioElement } = {};

const preloadSounds = () => {
    (Object.keys(soundsData) as SoundType[]).forEach(key => {
        if (!audioElements[key]) {
            const audio = new Audio(soundsData[key]);
            audio.preload = 'auto';
            audioElements[key] = audio;
        }
    });
};

// Eagerly preload sounds when this module is imported.
preloadSounds();

let isAudioUnlocked = false;

/**
 * Unlocks audio playback, which is often restricted by browsers until a user interaction.
 * This should be called from an event handler like a button click.
 */
export const unlockAudio = () => {
    if (isAudioUnlocked) {
        return;
    }
    isAudioUnlocked = true;

    // A common trick to enable audio playback in browsers is to play a sound
    // and immediately pause it within a user-initiated event.
    const anyAudio = audioElements['move'];
    if (anyAudio) {
        const promise = anyAudio.play();
        if (promise !== undefined) {
            promise.then(() => {
                anyAudio.pause();
                anyAudio.currentTime = 0;
            }).catch(() => {
                // This can fail if autoplay is disallowed.
                // If it fails, we'll try again on the next user interaction.
                isAudioUnlocked = false;
            });
        }
    }
}

export const playSound = (type: SoundType) => {
    const audio = audioElements[type];
    if (audio) {
        // This allows the sound to be played again before it has finished.
        audio.currentTime = 0;
        audio.play().catch(e => {
            // This warning can appear if audio playback is blocked by the browser.
            console.warn(`Could not play sound (${type}): ${e.message}`);
        });
    }
};
