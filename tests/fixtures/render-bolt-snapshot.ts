import { glyphAdvanceRatio, glyphLineAlphabet } from "@tscircuit/alphabet"
import { mat4 } from "gl-matrix"
import {
  SoftwareRenderer,
  createUint8Bitmap,
  encodePNG,
  type Camera,
  type DrawCall,
} from "poppygl"
import { createHexSocketBoltMesh, mp } from "../../src"

const width = 1400
const height = 1152
const scale = 2
const identity = mat4.create()

const drawCall = (
  positions: number[],
  color: [number, number, number, number],
): DrawCall => ({
  positions: new Float32Array(positions),
  normals: null,
  uvs: null,
  indices: null,
  model: identity,
  material: { baseColorFactor: color, baseColorTexture: null },
})

// Stroke-font labels are also drawn by PoppyGL, so snapshots need no browser,
// system fonts or second rendering engine on developer machines or in CI.
const label = (
  renderer: SoftwareRenderer,
  text: string,
  x: number,
  y: number,
  size: number,
) => {
  const vertices: number[] = []
  let cursor = x
  for (const character of text) {
    for (const stroke of glyphLineAlphabet[character] ?? []) {
      const x1 = cursor + stroke.x1 * size
      const y1 = y + size - stroke.y1 * size
      const x2 = cursor + stroke.x2 * size
      const y2 = y + size - stroke.y2 * size
      const length = Math.hypot(x2 - x1, y2 - y1)
      if (length === 0) continue
      const dx = (-(y2 - y1) / length) * size * 0.025
      const dy = ((x2 - x1) / length) * size * 0.025
      vertices.push(
        x1 + dx,
        y1 + dy,
        0,
        x1 - dx,
        y1 - dy,
        0,
        x2 - dx,
        y2 - dy,
        0,
        x1 + dx,
        y1 + dy,
        0,
        x2 - dx,
        y2 - dy,
        0,
        x2 + dx,
        y2 + dy,
        0,
      )
    }
    cursor += (glyphAdvanceRatio[character] ?? 0.4) * size
  }
  // Screen coordinates point downward, so reverse the glyph triangle winding.
  for (let i = 0; i < vertices.length; i += 9) {
    for (let axis = 0; axis < 3; axis++) {
      const value = vertices[i + 3 + axis]!
      vertices[i + 3 + axis] = vertices[i + 6 + axis]!
      vertices[i + 6 + axis] = value
    }
  }
  const mesh = drawCall(vertices, [0.07, 0.12, 0.19, 1])
  renderer.drawMesh(
    mesh,
    {
      view: identity,
      proj: mat4.ortho(mat4.create(), 0, width, height, 0, -1, 1),
    },
    { dir: [0, 0, -1], ambient: 1 },
    mesh.material,
    false,
    true,
  )
}

export async function renderBoltSnapshot() {
  const definition = mp.string("hexsocketbolt_m3_l6mm").json()
  if (definition.fn !== "hexsocketbolt") throw new Error("Expected bolt")
  const { fn, ...props } = definition
  const mesh = createHexSocketBoltMesh(props)
  // Separate vertices preserve sharp socket corners and thread flanks.
  const positions = mesh.indices.flatMap((index) =>
    mesh.positions.slice(index * 3, index * 3 + 3),
  )
  const bolt = drawCall(positions, [0.42, 0.49, 0.59, 1])
  const sheet = new SoftwareRenderer(width * scale, height * scale)
  sheet.clear([227, 233, 240, 255])
  const views = [
    {
      name: "ISOMETRIC",
      detail: "HEAD, SOCKET AND RIGHT-HAND THREAD",
      eye: [11, -16, 12],
      target: [0, 0, -1.4],
      span: 11.8,
    },
    {
      name: "TOP",
      detail: "2.5 mm HEX SOCKET / 5.5 mm HEAD DIAMETER",
      eye: [0, 0, 20],
      target: [0, 0, 0],
      span: 8.5,
    },
    {
      name: "FRONT",
      detail: "6 mm UNDER HEAD / 9 mm OVERALL",
      eye: [0, -20, -1.5],
      target: [0, 0, -1.5],
      span: 11.4,
    },
    {
      name: "UNDERSIDE",
      detail: "BEARING FACE, THREAD RUNOUT AND TIP",
      eye: [-12, -17, -13],
      target: [0, 0, -1.7],
      span: 11.8,
    },
  ] as const
  for (const [index, view] of views.entries()) {
    const panel = new SoftwareRenderer(660 * scale, 440 * scale)
    panel.clear([241, 244, 248, 255])
    const half = view.span / 2
    const camera: Camera = {
      view: mat4.lookAt(
        mat4.create(),
        view.eye,
        view.target,
        view.name === "TOP" ? [0, 1, 0] : [0, 0, 1],
      ),
      proj: mat4.ortho(
        mat4.create(),
        -half * 1.5,
        half * 1.5,
        -half,
        half,
        0.1,
        100,
      ),
    }
    panel.drawMesh(
      bolt,
      camera,
      { dir: [-0.4, 0.7, -0.6], ambient: 0.3 },
      bolt.material,
      true,
      true,
    )
    const left = 32 + (index % 2) * 676
    const top = 144 + Math.floor(index / 2) * 476
    for (let y = 0; y < panel.height; y++) {
      const start = ((top * scale + y) * sheet.width + left * scale) * 4
      sheet.bitmap.data.set(
        panel.bitmap.data.subarray(
          y * panel.width * 4,
          (y + 1) * panel.width * 4,
        ),
        start,
      )
    }
    label(sheet, view.name, left + 22, top + 7, 20)
    label(sheet, view.detail, left + 22, top + 401, 17)
  }
  label(sheet, "M3 x 6 mm / METRIC HEX SOCKET BOLT", 32, 20, 38)
  label(
    sheet,
    "hexsocketbolt_m3_l6mm / 0.5 mm PITCH / 3 mm HEAD HEIGHT",
    32,
    75,
    21,
  )
  label(
    sheet,
    "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / APPROXIMATE THREAD GEOMETRY",
    32,
    1101,
    17,
  )

  const bitmap = createUint8Bitmap(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        const at = (y * scale * sheet.width + x * scale) * 4 + c
        bitmap.data[(y * width + x) * 4 + c] = Math.round(
          (sheet.buffer[at]! +
            sheet.buffer[at + 4]! +
            sheet.buffer[at + sheet.width * 4]! +
            sheet.buffer[at + sheet.width * 4 + 4]!) /
            4,
        )
      }
    }
  }
  return encodePNG(bitmap)
}
