import React, { useRef, useEffect } from 'react'

type Props = {
  imageUrl?: string
  className?: string
  strength?: number
}

// Very small WebGL-based "liquid glass" demo shader.
// - If imageUrl is provided it will be used as the background texture.
// - Otherwise a generated gradient texture is used.
// - Mouse interaction drives the refraction center.
const LiquidGlass: React.FC<Props> = ({ imageUrl, className = '', strength = 0.18 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
  if (!gl) return // No WebGL: silently fail to CSS fallback
  const _gl = gl as WebGLRenderingContext
  const _canvas = canvas as HTMLCanvasElement

    const vertexSrc = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `

    const fragmentSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_tex;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_strength;

    // Simple 2D noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = v_uv;
      // normalized mouse (0..1)
      vec2 m = u_mouse / u_resolution;

      // compute vector from mouse to pixel
      vec2 d = uv - m;
      float dist = length(d);

      // generate a normal-like disturbance using noise and time
      float n = noise(uv * 10.0 + u_time * 0.1);
      vec2 offset = normalize(d + 0.001) * ( (1.0 - smoothstep(0.0, 0.6, dist)) * u_strength * (0.6 + n*0.8) );

      // sample the texture with a small displaced uv to emulate refraction
      vec2 sampleUV = uv + offset;
      vec4 color = texture2D(u_tex, sampleUV);

      // apply a subtle frosted look by blending with a desaturated color
      float frost = smoothstep(0.0, 0.6, dist);
      vec3 frostCol = vec3(0.95, 0.97, 0.99);
      vec3 outCol = mix(color.rgb, mix(color.rgb, frostCol, 0.25), frost * 0.7);

      // Soft vignette
      outCol *= 1.0 - 0.25 * smoothstep(0.6, 1.0, dist);

      gl_FragColor = vec4(outCol, 0.9 - 0.6 * frost);
    }
    `

    function compile(shaderType: number, source: string) {
      const shader = _gl.createShader(shaderType)!
      _gl.shaderSource(shader, source)
      _gl.compileShader(shader)
      if (!_gl.getShaderParameter(shader, ( _gl as any ).COMPILE_STATUS)) {
        console.error('Shader compile error:', _gl.getShaderInfoLog(shader))
      }
      return shader
    }

    const vShader = compile(( _gl as any ).VERTEX_SHADER, vertexSrc)
    const fShader = compile(( _gl as any ).FRAGMENT_SHADER, fragmentSrc)
    const program = _gl.createProgram()!
    _gl.attachShader(program, vShader)
    _gl.attachShader(program, fShader)
    _gl.linkProgram(program)

    if (!_gl.getProgramParameter(program, ( _gl as any ).LINK_STATUS)) {
      console.error('Program link error:', _gl.getProgramInfoLog(program))
      return
    }

    const posLoc = _gl.getAttribLocation(program, 'a_position')
    const resLoc = _gl.getUniformLocation(program, 'u_resolution')
    const mouseLoc = _gl.getUniformLocation(program, 'u_mouse')
    const timeLoc = _gl.getUniformLocation(program, 'u_time')
    const strengthLoc = _gl.getUniformLocation(program, 'u_strength')

    // Fullscreen quad
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]), gl.STATIC_DRAW)

    // Setup texture (will be updated when image loads or gradient generated)
    const tex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    function updateTextureFromImage(img: HTMLImageElement | HTMLCanvasElement) {
      _gl.bindTexture(_gl.TEXTURE_2D, tex)
      _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, 0)
      try {
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, img)
      } catch (e) {
        // Some browsers require canvas sized to power-of-two for certain ops; the fallback below will still work with LINEAR
        console.warn('texImage2D failed', e)
      }
    }

    // If an image URL is provided, load it. Otherwise generate a gradient canvas.
    if (imageUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => updateTextureFromImage(img)
      img.onerror = () => {
        // fallback: gradient
        const g = document.createElement('canvas')
        g.width = 512; g.height = 512
        const ctx = g.getContext('2d')!
        const grad = ctx.createLinearGradient(0, 0, g.width, g.height)
        grad.addColorStop(0, '#7b61ff')
        grad.addColorStop(1, '#00d2ff')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, g.width, g.height)
        updateTextureFromImage(g)
      }
      img.src = imageUrl
    } else {
      const g = document.createElement('canvas')
      g.width = 512; g.height = 512
      const ctx = g.getContext('2d')!
      const grad = ctx.createLinearGradient(0, 0, g.width, g.height)
      grad.addColorStop(0, '#7b61ff')
      grad.addColorStop(1, '#00d2ff')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, g.width, g.height)
      updateTextureFromImage(g)
    }

  let start = performance.now()
  let mouse = { x: _canvas.width / 2, y: _canvas.height / 2 }

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const w = Math.floor(_canvas.clientWidth * dpr)
      const h = Math.floor(_canvas.clientHeight * dpr)
      if (_canvas.width !== w || _canvas.height !== h) {
        _canvas.width = w
        _canvas.height = h
        _gl.viewport(0, 0, w, h)
      }
    }

    function render() {
      resize()
  _gl.clearColor(0,0,0,0)
  _gl.clear(_gl.COLOR_BUFFER_BIT)

  _gl.useProgram(program)
  _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer)
  _gl.enableVertexAttribArray(posLoc)
  _gl.vertexAttribPointer(posLoc, 2, _gl.FLOAT, false, 0, 0)

  _gl.activeTexture(_gl.TEXTURE0)
  _gl.bindTexture(_gl.TEXTURE_2D, tex)

  _gl.uniform2f(resLoc, _canvas.width, _canvas.height)
  _gl.uniform2f(mouseLoc, mouse.x, mouse.y)
  _gl.uniform1f(timeLoc, (performance.now() - start) * 0.001)
  _gl.uniform1f(strengthLoc, strength)

  _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, 4)

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    function onMove(e: MouseEvent) {
      const rect = _canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) * (_canvas.width / rect.width)
      mouse.y = (rect.height - (e.clientY - rect.top)) * (_canvas.height / rect.height)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', (ev: TouchEvent) => {
      if (ev.touches && ev.touches[0]) onMove(ev.touches[0] as unknown as MouseEvent)
    }, { passive: true })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [imageUrl, strength])

  // If WebGL isn't available the canvas will be blank — provide a lightweight fallback
  return (
    <div className={`liquid-glass-root ${className}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', mixBlendMode: 'screen' }} />
      <style>{`
        .liquid-glass-root canvas { backdrop-filter: blur(6px) saturate(120%); }
      `}</style>
    </div>
  )
}

export default LiquidGlass
