export function playCashRegisterSound(): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const now = audioContext.currentTime;

    // Oscilator principal - sunet metalic / electronic scurt
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();

    osc1.type = "square";
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(audioContext.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    // Al doilea "cling"
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(900, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.16);

    gain2.gain.setValueAtTime(0.0001, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.12, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc2.connect(gain2);
    gain2.connect(audioContext.destination);

    osc2.start(now + 0.06);
    osc2.stop(now + 0.18);

    // Click de început
    const bufferSize = audioContext.sampleRate * 0.02;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();

    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    noise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noise.start(now);
}