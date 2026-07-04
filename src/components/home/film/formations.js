// formations.js — DSD Day film shapes. Same sampling DNA as the FFC company profile:
// image masks (emblem / chair / archipelago) sampled to particle positions, plus the
// programmatic journey timeline and an idle dust field.

export const WORLD = 5;

export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}

// Sample a transparent-background mask image into N particle positions (ink = alpha>threshold).
export function imageToPositions(N, img, opts = {}) {
    const {
        threshold = 36,
        inkMax = 0.985,
        boxW = WORLD * 0.84,
        boxH = WORLD * 0.84,
        jitter = 0.02,
        z = 0,
        offsetX = 0,
        offsetY = 0,
    } = opts;

    const cw = Math.max(1, img.naturalWidth || img.width);
    const ch = Math.max(1, img.naturalHeight || img.height);
    const cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);

    const { data } = ctx.getImageData(0, 0, cw, ch);
    const pts = [];
    for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
            const idx = (y * cw + x) * 4;
            if (data[idx + 3] <= threshold) continue;
            const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
            if (lum > inkMax) continue;
            pts.push([x, y]);
        }
    }

    const out = new Float32Array(N * 3);
    if (pts.length === 0) return out;
    shuffle(pts);

    const halfW = cw / 2, halfH = ch / 2;
    const s = Math.min(boxW / halfW, boxH / halfH);
    for (let i = 0; i < N; i++) {
        const p = pts[i % pts.length];
        out[i * 3 + 0] = (p[0] - halfW) * s + offsetX + (Math.random() - 0.5) * jitter;
        out[i * 3 + 1] = -(p[1] - halfH) * s + offsetY + (Math.random() - 0.5) * jitter;
        out[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;
    }
    return out;
}

// The journey: a rising growth line with milestone nodes (year labels live in the DOM).
export function timelineToPositions(N, opts = {}) {
    const {
        points = 6,
        spanX = WORLD * 1.35,
        rise = WORLD * 0.7,
        nodeRatio = 0.42,
        nodeRadius = 0.16,
        lineJitter = 0.06,
    } = opts;

    const out = new Float32Array(N * 3);
    const nodes = [];
    for (let i = 0; i < points; i++) {
        const t = i / (points - 1);
        nodes.push([(t - 0.5) * 2 * spanX, (Math.pow(t, 1.25) - 0.5) * rise, 0]);
    }
    const gauss = () => {
        let u = 0, v = 0;
        for (let k = 0; k < 3; k++) { u += Math.random(); v += Math.random(); }
        return (u - v) * 0.5;
    };
    const nNode = Math.floor(N * nodeRatio);
    for (let i = 0; i < nNode; i++) {
        const nn = nodes[i % nodes.length];
        out[i * 3 + 0] = nn[0] + gauss() * nodeRadius;
        out[i * 3 + 1] = nn[1] + gauss() * nodeRadius;
        out[i * 3 + 2] = gauss() * nodeRadius;
    }
    for (let i = nNode; i < N; i++) {
        const seg = i % (points - 1);
        const a = nodes[seg], b = nodes[seg + 1];
        const t = Math.random();
        out[i * 3 + 0] = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * lineJitter;
        out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * lineJitter;
        out[i * 3 + 2] = (Math.random() - 0.5) * lineJitter;
    }
    return out;
}

// Idle dust — a loose breathing field for the film's open and close.
export function dustToPositions(N, { spread = WORLD * 1.7, depth = 2.4 } = {}) {
    const out = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        out[i * 3 + 0] = (Math.random() - 0.5) * 2 * spread;
        out[i * 3 + 1] = (Math.random() - 0.5) * 2 * spread * 0.62;
        out[i * 3 + 2] = (Math.random() - 0.5) * depth;
    }
    return out;
}
