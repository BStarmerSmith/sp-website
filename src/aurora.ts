import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'

// GLSL ES 1.00 — compiles on both WebGL1 and WebGL2
const VERT = /* glsl */`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */`
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  if (x0.x > x0.y) { i1 = vec2(1.0, 0.0); } else { i1 = vec2(0.0, 1.0); }
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 colorRamp(float t) {
  if (t < 0.5) {
    return mix(uColorStops[0], uColorStops[1], t * 2.0);
  }
  return mix(uColorStops[1], uColorStops[2], (t - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 rampColor = colorRamp(uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;
  gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`

export interface AuroraConfig {
  container: HTMLElement
  /** Three hex colour stops for the aurora gradient. Defaults to brand pink/purple/coral */
  colorStops?: [string, string, string]
  /** Wave height intensity. Defaults to 1.0 */
  amplitude?: number
  /** Edge softness. Defaults to 0.5 */
  blend?: number
  /** Playback speed multiplier. Defaults to 1.0 */
  speed?: number
}

export class Aurora {
  private readonly renderer: Renderer
  private readonly program: Program
  private animId = 0

  constructor(config: AuroraConfig) {
    const isMobile = window.innerWidth < 768
    const {
      container,
      colorStops = ['#EA98DA', '#8A4DFF', '#FFBEB6'],
      amplitude = isMobile ? 0.6 : 1.0,
      blend = isMobile ? 0.4 : 0.5,
      speed = isMobile ? 0.6 : 1.0,
    } = config

    this.renderer = new Renderer({ alpha: true, antialias: true })
    const gl = this.renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'

    const toRgb = (hex: string) => { const c = new Color(hex); return [c.r, c.g, c.b] }

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv

    this.program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: amplitude },
        uColorStops: { value: colorStops.map(toRgb) },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uBlend:      { value: blend },
      },
    })

    const mesh = new Mesh(gl, { geometry, program: this.program })
    container.appendChild(gl.canvas)

    const resize = () => {
      this.renderer.setSize(container.offsetWidth, container.offsetHeight)
      this.program.uniforms.uResolution.value = [container.offsetWidth, container.offsetHeight]
    }
    window.addEventListener('resize', resize)
    resize()

    const update = (t: number) => {
      this.animId = requestAnimationFrame(update)
      this.program.uniforms.uTime.value = t * 0.001 * speed
      this.renderer.render({ scene: mesh })
    }
    this.animId = requestAnimationFrame(update)
  }

  destroy(): void {
    cancelAnimationFrame(this.animId)
    this.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
