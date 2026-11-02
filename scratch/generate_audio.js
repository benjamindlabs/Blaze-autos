const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION = 6.5; // seconds
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

// Create Stereo WAV Buffer (16-bit PCM)
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = SAMPLE_RATE * blockAlign;
const dataSize = NUM_SAMPLES * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// Write WAV Header
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

// Helper for soft distortion/saturation (tube warmth)
function saturate(x, drive = 1.6) {
  return Math.tanh(x * drive);
}

// Low-pass filter state
let lpfL = 0;
let lpfR = 0;

let offset = 44;
let phaseStarter = 0;
let phaseEngine = 0;
let phaseTurbo = 0;

for (let i = 0; i < NUM_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  let sampleL = 0;
  let sampleR = 0;

  // -------------------------------------------------------------
  // 1. STARTER MOTOR (0.0s -> 0.75s)
  // -------------------------------------------------------------
  if (t < 0.8) {
    const starterEnv = Math.min(t / 0.05, 1) * Math.max(0, 1 - (t - 0.65) / 0.15);
    const starterFreq = 220 + t * 90; // 220Hz -> 285Hz
    phaseStarter += (2 * Math.PI * starterFreq) / SAMPLE_RATE;

    // Starter mechanical gear whine + rhythmic compression pulses
    const gearWhine = Math.sin(phaseStarter) * 0.35 + Math.sin(phaseStarter * 2) * 0.15;
    const compressionPulse = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 6.5 * t)), 4) * 0.5;

    const s = (gearWhine + compressionPulse) * starterEnv * 0.45;
    sampleL += s;
    sampleR += s * 0.95;
  }

  // -------------------------------------------------------------
  // 2. IGNITION DETONATION SURGE (0.72s -> 2.2s)
  // -------------------------------------------------------------
  if (t >= 0.72 && t < 2.2) {
    const surgeT = t - 0.72;
    // Initial violent explosion punch
    const punchEnv = Math.exp(-surgeT * 4.5);
    const subBassFreq = 62 * Math.exp(-surgeT * 2.5); // 62Hz down to 25Hz
    const punchOsc = Math.sin(2 * Math.PI * subBassFreq * surgeT);

    // Combustion roar (shaped noise + distortion)
    const roarNoise = (Math.random() * 2 - 1) * Math.exp(-surgeT * 2.0);
    const explosion = (punchOsc * 0.8 + roarNoise * 0.45) * punchEnv;

    sampleL += explosion * 0.85;
    sampleR += explosion * 0.85;
  }

  // -------------------------------------------------------------
  // 3. ENGINE FIRING CYLINDERS (0.75s -> 6.5s)
  // Crossplane V8 Firing: 0.75s flare to 2,400 RPM, then idle at 850 RPM
  // -------------------------------------------------------------
  if (t >= 0.75) {
    const engT = t - 0.75;
    // RPM profile: flares up to 2,400 RPM (160 Hz firing freq), settles to 850 RPM (56.6 Hz)
    let rpmFreq;
    if (engT < 0.4) {
      // Rapid flare to 2,400 RPM
      rpmFreq = 80 + (engT / 0.4) * 80;
    } else if (engT < 2.0) {
      // Settle down from 2,400 RPM to 850 RPM
      const decel = (engT - 0.4) / 1.6;
      rpmFreq = 160 - decel * (160 - 56.6);
    } else {
      // Steady idle at 850 RPM with subtle natural breathing
      rpmFreq = 56.6 + Math.sin(engT * 1.8) * 1.5;
    }

    phaseEngine += (2 * Math.PI * rpmFreq) / SAMPLE_RATE;

    // Crossplane V8 uneven acoustic signature: fundamental + 2nd, 3rd, 4th harmonics + sub-octave rumble
    const h1 = Math.sin(phaseEngine) * 0.6;
    const h2 = Math.sin(phaseEngine * 2 + 0.3) * 0.35;
    const h3 = Math.sin(phaseEngine * 3 + 0.7) * 0.25;
    const h4 = Math.sin(phaseEngine * 4 + 1.2) * 0.15;
    const subH = Math.sin(phaseEngine * 0.5) * 0.35; // visceral exhaust pipe chest-thump

    // Exhaust pipe resonance pulse
    const exhaustPulse = Math.pow(Math.max(0, Math.sin(phaseEngine * 0.5)), 6) * 0.3;

    // Turbo spool whistle (subtle high-end hiss)
    const turboFreq = 2600 + (rpmFreq / 160) * 1200;
    phaseTurbo += (2 * Math.PI * turboFreq) / SAMPLE_RATE;
    const turboWhistle = Math.sin(phaseTurbo) * 0.04 * (rpmFreq / 160);

    // Overrun exhaust pops during deceleration (1.2s -> 2.5s)
    let exhaustPop = 0;
    if (engT > 0.6 && engT < 1.8) {
      if (Math.random() < 0.003) {
        exhaustPop = (Math.random() * 2 - 1) * 0.4;
      }
    }

    const engEnv = Math.min(engT / 0.15, 1);
    // Master fade out at end of clip
    const fadeOut = t > 5.5 ? Math.max(0, 1 - (t - 5.5) / 1.0) : 1;

    let totalEng = (h1 + h2 + h3 + h4 + subH + exhaustPulse + turboWhistle + exhaustPop) * engEnv * fadeOut;

    // Slight stereo phase difference for realistic acoustic room width
    sampleL += totalEng * 0.75;
    sampleR += (h1 + h2 * 0.9 + h3 * 1.1 + h4 + subH + exhaustPulse * 0.95 + exhaustPop * 1.2) * engEnv * fadeOut * 0.75;
  }

  // Soft low-pass smoothing & analog saturation
  lpfL += (sampleL - lpfL) * 0.45;
  lpfR += (sampleR - lpfR) * 0.45;

  const outL = saturate(lpfL, 1.35) * 0.88;
  const outR = saturate(lpfR, 1.35) * 0.88;

  // Convert to 16-bit PCM integer
  const intL = Math.max(-32768, Math.min(32767, Math.floor(outL * 32767)));
  const intR = Math.max(-32768, Math.min(32767, Math.floor(outR * 32767)));

  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

// Ensure public/audio directory exists
const audioDir = path.join(__dirname, "..", "public", "audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const outputPath = path.join(audioDir, "amg-v8-cold-start.wav");
fs.writeFileSync(outputPath, buffer);
console.log(`Successfully generated high-definition AMG V8 Cold Start audio at: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

