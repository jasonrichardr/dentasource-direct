import React, { useRef, useEffect, useState } from 'react';

// Types for component props
interface HeroProps {
    trustBadge?: {
        text: string;
        icons?: string[];
    };
    headline: {
        line1: string;
        line2: string;
    };
    subtitle: string;
    buttons?: {
        primary?: {
            text: string;
            onClick?: () => void;
        };
        secondary?: {
            text: string;
            onClick?: () => void;
        };
    };
    className?: string;
}

const defaultShaderSource = `#version 300 es
// Space Starfield Shader
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy

// Hash function for random values
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// 2D Rotation Matrix
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// Create a single star with optional flare
float star(vec2 uv, float flare) {
    float d = length(uv);
    float m = .02 / d;
    
    float rays = max(0., 1. - abs(uv.x * uv.y * 1000.));
    m += rays * flare;
    uv *= rot(3.1415/4.);
    rays = max(0., 1. - abs(uv.x * uv.y * 1000.));
    m += rays * .3 * flare;
    
    m *= smoothstep(1., .2, d);
    return m;
}

// Generate a grid layer of stars
vec3 starLayer(vec2 uv) {
    vec3 col = vec3(0);
    
    vec2 gv = fract(uv) - .5; // Grid point coordinates (-0.5 to 0.5)
    vec2 id = floor(uv);      // Grid cell ID
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offs = vec2(x, y);
            
            float n = hash21(id + offs); // Random value [0, 1] per neighbor cell
            float size = fract(n * 345.32);
            
            // Random offset within the cell
            vec2 p = vec2(n, fract(n * 34.));
            
            float s = star(gv - offs - p + .5, smoothstep(.9, 1., size) * .6);
            
            // Give stars mostly white color, with some occasional rainbow colors
            vec3 color = vec3(1.); // Default white
            
            if(n > 0.8) {
               // ~20% of stars get a rainbow tint
               color = sin(vec3(.2, .3, .9) * fract(n * 2345.2) * 123.2) * .5 + .5;
               // Boost the brightness of the colored stars
               color = color * 1.5 + 0.5;
            }
            
            // Twinkle effect
            s *= sin(time * 2. + n * 6.2831) * .4 + .6; 
            
            col += s * size * color;
        }
    }
    return col;
}

void main(void) {
    vec2 uv = (FC - .5 * resolution.xy) / resolution.y;
    vec3 col = vec3(0);
    
    float t = time * 0.05; // Base movement speed
    
    // Slight slow rotation over time
    uv *= rot(t * 0.1);
    
    // Multiple layers of stars for parallax
    for (float i = 0.; i < 1.; i += 1. / 4.) {
        float depth = fract(i + t);
        
        // Scale determines distance
        float scale = mix(15., .5, depth);
        
        // Stars fade out as they get distant
        float fade = depth * smoothstep(1., .9, depth);
        
        // Give each layer a slightly different offset
        col += starLayer(uv * scale + i * 453.2) * fade;
    }
    
    // Minimal dark ambient background for deep space
    vec3 neb = vec3(0.01, 0.01, 0.02);
    col += neb * (1.5 - length(uv));
    
    O = vec4(col, 1.0);
}`;

// WebGL Renderer class
class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private vs: WebGLShader | null = null;
    private fs: WebGLShader | null = null;
    private buffer: WebGLBuffer | null = null;
    private scale: number;
    private shaderSource: string;
    private mouseMove = [0, 0];
    private mouseCoords = [0, 0];
    private pointerCoords = [0, 0];
    private nbrOfPointers = 0;
    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas: HTMLCanvasElement, scale: number) {
        this.canvas = canvas;
        this.scale = scale;
        this.gl = canvas.getContext('webgl2')!;
        this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
        this.shaderSource = defaultShaderSource;
    }

    updateShader(source: string) {
        this.reset();
        this.shaderSource = source;
        this.setup();
        this.init();
    }

    updateMove(deltas: number[]) {
        this.mouseMove = deltas;
    }

    updateMouse(coords: number[]) {
        this.mouseCoords = coords;
    }

    updatePointerCoords(coords: number[]) {
        this.pointerCoords = coords;
    }

    updatePointerCount(nbr: number) {
        this.nbrOfPointers = nbr;
    }

    updateScale(scale: number) {
        this.scale = scale;
        this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader: WebGLShader, source: string) {
        const gl = this.gl;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Shader compilation error:', error);
        }
    }

    test(source: string) {
        let result = null;
        const gl = this.gl;
        const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            result = gl.getShaderInfoLog(shader);
        }
        gl.deleteShader(shader);
        return result;
    }

    reset() {
        const gl = this.gl;
        if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
            if (this.vs) {
                gl.detachShader(this.program, this.vs);
                gl.deleteShader(this.vs);
            }
            if (this.fs) {
                gl.detachShader(this.program, this.fs);
                gl.deleteShader(this.fs);
            }
            gl.deleteProgram(this.program);
        }
    }

    setup() {
        const gl = this.gl;
        this.vs = gl.createShader(gl.VERTEX_SHADER)!;
        this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
        this.compile(this.vs, this.vertexSrc);
        this.compile(this.fs, this.shaderSource);
        this.program = gl.createProgram()!;
        gl.attachShader(this.program, this.vs);
        gl.attachShader(this.program, this.fs);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
        }
    }

    init() {
        const gl = this.gl;
        const program = this.program!;

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        (program as any).resolution = gl.getUniformLocation(program, 'resolution');
        (program as any).time = gl.getUniformLocation(program, 'time');
        (program as any).move = gl.getUniformLocation(program, 'move');
        (program as any).touch = gl.getUniformLocation(program, 'touch');
        (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
        (program as any).pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
        const gl = this.gl;
        const program = this.program;

        if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f((program as any).time, now * 1e-3);
        gl.uniform2f((program as any).move, this.mouseMove[0], this.mouseMove[1]);
        gl.uniform2f((program as any).touch, this.mouseCoords[0], this.mouseCoords[1]);
        gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
        gl.uniform2fv((program as any).pointers, this.pointerCoords);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

// Pointer Handler class
class PointerHandler {
    private scale: number;
    private active = false;
    private pointers = new Map<number, number[]>();
    private lastCoords = [0, 0];
    private moves = [0, 0];

    constructor(element: HTMLCanvasElement, scale: number) {
        this.scale = scale;

        const map = (element: HTMLCanvasElement, scale: number, x: number, y: number) =>
            [x * scale, element.height - y * scale];

        element.addEventListener('pointerdown', (e) => {
            this.active = true;
            this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        });

        element.addEventListener('pointerup', (e) => {
            if (this.count === 1) {
                this.lastCoords = this.first;
            }
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
        });

        element.addEventListener('pointerleave', (e) => {
            if (this.count === 1) {
                this.lastCoords = this.first;
            }
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
        });

        element.addEventListener('pointermove', (e) => {
            if (!this.active) return;
            this.lastCoords = [e.clientX, e.clientY];
            this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
            this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
        });
    }

    getScale() {
        return this.scale;
    }

    updateScale(scale: number) {
        this.scale = scale;
    }

    get count() {
        return this.pointers.size;
    }

    get move() {
        return this.moves;
    }

    get coords() {
        return this.pointers.size > 0
            ? Array.from(this.pointers.values()).flat()
            : [0, 0];
    }

    get first() {
        return this.pointers.values().next().value || this.lastCoords;
    }
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const rendererRef = useRef<any>(null);
    const pointersRef = useRef<any>(null);


    const resize = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        if (rendererRef.current) {
            rendererRef.current.updateScale(dpr);
        }
    };

    const loop = (now: number) => {
        if (!rendererRef.current || !pointersRef.current) return;

        rendererRef.current.updateMouse(pointersRef.current.first);
        rendererRef.current.updatePointerCount(pointersRef.current.count);
        rendererRef.current.updatePointerCoords(pointersRef.current.coords);
        rendererRef.current.updateMove(pointersRef.current.move);
        rendererRef.current.render(now);
        animationFrameRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

        rendererRef.current = new WebGLRenderer(canvas, dpr);
        pointersRef.current = new PointerHandler(canvas, dpr);

        rendererRef.current.setup();
        rendererRef.current.init();

        resize();

        if (rendererRef.current.test(defaultShaderSource) === null) {
            rendererRef.current.updateShader(defaultShaderSource);
        }

        loop(0);

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.reset();
            }
        };
    }, []);

    return canvasRef;
};

// Reusable Hero Component
const Hero: React.FC<HeroProps> = ({
    trustBadge,
    headline,
    subtitle,
    buttons,
    className = ""
}) => {
    const canvasRef = useShaderBackground();

    return (
        <div className={`relative w-full overflow-hidden bg-black ${className}`}>
            <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover touch-none pointer-events-none"
                style={{ background: 'black' }}
            />

            {/* Hero Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white h-full w-full py-16 px-4">
                {/* Trust Badge */}
                {trustBadge && (
                    <div className="mb-8 animate-fade-in-down">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs opacity-60 transition-opacity hover:opacity-100">
                            {trustBadge.icons && (
                                <div className="flex">
                                    {trustBadge.icons.map((icon, index) => (
                                        <span key={index} className={`text-${index === 0 ? 'yellow' : index === 1 ? 'orange' : 'amber'}-300/70 text-[10px]`}>
                                            {icon}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <span className="text-white/80 font-light tracking-wide">{trustBadge.text}</span>
                        </div>
                    </div>
                )}

                <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
                    {/* Main Heading with Animation */}
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                            {headline.line1}
                        </h1>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-400">
                            {headline.line2}
                        </h1>
                    </div>

                    {/* Subtitle with Animation */}
                    <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
                        <p className="text-sm md:text-base lg:text-base text-orange-100/90 font-light leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* CTA Buttons with Animation */}
                    {buttons && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-800">
                            {buttons.primary && (
                                <button
                                    onClick={buttons.primary.onClick}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 pointer-events-auto cursor-pointer"
                                >
                                    {buttons.primary.text}
                                </button>
                            )}
                            {buttons.secondary && (
                                <button
                                    onClick={buttons.secondary.onClick}
                                    className="px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-300/30 hover:border-orange-300/50 text-orange-100 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm pointer-events-auto cursor-pointer"
                                >
                                    {buttons.secondary.text}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
