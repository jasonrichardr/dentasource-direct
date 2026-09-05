// engine/shaders.js — the morph engine. Three injects position, projectionMatrix and
// modelViewMatrix; we add aTarget (state B), aRandom (per-particle randoms) and the
// uniforms. The whole effect is mix(stateA, stateB, uProgress) + noise.

export const vertexShader = /* glsl */ `
  attribute vec3 aTarget;   // where this particle goes in the NEXT formation
  attribute vec4 aRandom;   // stable per-particle randoms (stagger, turbulence, size)
  attribute vec3 aColor;       // this dot's colour in the CURRENT formation
  attribute vec3 aColorTarget; // and in the next one

  uniform float uProgress;        // 0..1 within the CURRENT segment (driven by scroll)
  uniform float uDelay;           // per-particle stagger spread
  uniform float uSize;            // base point size
  uniform float uNoiseFrequency;
  uniform float uNoiseStrength;   // mid-morph bulge distance
  uniform float uTime;
  uniform float uIdle;            // idle drift amount
  uniform float uMaxSize;         // upper clamp on point size in px (smaller on mobile)
  uniform float uTextLock;        // 1.0 = arriving at a TEXT state -> calm the turbulence
  uniform vec2  uVideoScale;      // maps particle xy -> photo UV (0..1)
  // A formation either wears the colours sampled from its source image (a logo, a
  // wordmark) or the uniform brand colour (a sphere, the heart). uTintA and uTintB carry
  // that as a WEIGHT per formation rather than a branch, so a morph from a sampled
  // formation to a uniform one simply lerps the weight to zero and lands on whatever the
  // director has the uniform doing. The lockup to heart transition is that and nothing
  // more: sampled colour on one side, red on the other.
  uniform float uTintA;
  uniform float uTintB;
  uniform float uSizeA;           // per formation point size scale, lerped like everything
  uniform float uSizeB;

  varying vec4  vRandom;
  varying float vFade;
  varying vec2  vVideoUv;
  varying vec3  vTint;
  varying float vTintW;

  // ---- Ashima 3D simplex noise (snoise) ----
  vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vRandom = aRandom;

    vec3 startPos = position;
    vec3 endPos   = aTarget;

    // 1) PER-PARTICLE STAGGER — each dot starts its move at a different time, chosen by
    //    simplex noise. This is what makes the cloud FLOW like sand instead of snapping.
    float noiseStart  = snoise(startPos * uNoiseFrequency);
    float noiseTarget = snoise(endPos   * uNoiseFrequency);
    float noise = smoothstep(-1.0, 1.0, mix(noiseStart, noiseTarget, uProgress));

    float duration = 1.0 - uDelay;
    float start = (1.0 - duration) * noise;
    float end   = duration + start;
    float progress = smoothstep(start, end, uProgress); // this particle's own 0..1
    vFade = 1.0;

    // 2) THE MORPH — the entire effect is this one line.
    vec3 mixedPosition = mix(startPos, endPos, progress);

    // 3) MID-MORPH TURBULENCE — bulge outward most at the halfway point, calm at both
    //    ends, so every transition breathes. uTextLock dials it toward 0 when we arrive
    //    at a TEXT state so the words stay readable.
    float bulge = (1.0 - abs(uProgress * 2.0 - 1.0)) * (1.0 - uTextLock * 0.85);
    mixedPosition = mix(
      mixedPosition,
      mixedPosition + ((aRandom.xyz * 2.0 - 1.0) * (noise * 2.0 - 1.0)) * uNoiseStrength,
      bulge
    );

    // 4) IDLE DRIFT — gentle wander so it is never dead-static.
    float idle = uIdle * (0.4 + aRandom.w);
    mixedPosition += idle * vec3(
      snoise(mixedPosition * 0.4 + uTime * 0.2),
      snoise(mixedPosition * 0.4 + uTime * 0.2 + 31.0),
      snoise(mixedPosition * 0.4 + uTime * 0.2 + 67.0)
    );

    // photo UV from the final particle position. Three textures default to flipY=true, so
    // plane-top (pos.y+ -> v=1) already samples the image top — no extra flip.
    vVideoUv = mixedPosition.xy * uVideoScale + 0.5;

    // the dot's own colour, and how much of it to use, both carried across the morph
    vTint = mix(aColor, aColorTarget, progress);
    vTintW = mix(uTintA, uTintB, progress);

    vec4 mvPos = modelViewMatrix * vec4(mixedPosition, 1.0);

    // 5) POINT SIZE — distance-attenuated + per-particle jitter, CLAMPED both ways. The
    //    lower bound keeps far dots visible; the upper bound stops near-camera explosion.
    // A sampled formation reads as a logo rather than confetti when its dots are SMALLER
    // and denser, so each formation carries its own size scale across the morph.
    float sizeScale = mix(uSizeA, uSizeB, progress);
    gl_PointSize = clamp(uSize * sizeScale / -mvPos.z * (aRandom.x * 0.6 + 0.5), 1.5, uMaxSize);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3  uColorA;   // base dot color
  uniform vec3  uColorB;   // accent for a little per-particle variance
  uniform float uAlpha;
  uniform sampler2D uVideo; // photo / video texture
  uniform float uVideoMix;  // 0 = brand color, 1 = pure photo color (driven by scroll)
  uniform float uVideoGain; // brightness gain on the sampled photo (1.0 = true-to-life)
  // The theme's exposure, applied to the SAMPLED colours the same way it is applied to
  // the brand colours on the CPU side. Multiplied, never replaced: at night every dot
  // contributes less so overlapping dots sum to a colour instead of clipping to white.
  uniform float uTintGain;

  varying vec4  vRandom;
  varying float vFade;
  varying vec2  vVideoUv;
  varying vec3  vTint;
  varying float vTintW;

  void main() {
    // soft round dot from the square point sprite
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - 0.5);
    float circle = smoothstep(0.5, 0.38, d);
    if (circle <= 0.001) discard;

    // a few percent of dots lean to the accent -> richer than a flat single color
    vec3 col = mix(uColorA, uColorB, step(0.92, vRandom.z) * 0.8);
    // and where the formation was sampled from a source image, the dot wears that pixel
    col = mix(col, vTint * uTintGain, vTintW);

    // PHOTO — each dot takes the color of the sampled image at its position
    if (uVideoMix > 0.001) {
      vec3 vid = texture2D(uVideo, clamp(vVideoUv, 0.0, 1.0)).rgb * uVideoGain;
      col = mix(col, vid, uVideoMix);
    }
    gl_FragColor = vec4(col, circle * uAlpha * vFade);
  }
`;
