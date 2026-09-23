import { mat4 } from "gl-matrix"
import { SoftwareRenderer, encodePNG } from "poppygl"
import { createSheetMetalMesh } from "../../src"
import { sheetMetalExamples } from "./sheet-metal-examples"

export function renderSheetMetalSnapshot() {
  const width = 1200,
    height = 800
  const sheet = new SoftwareRenderer(width, height)
  sheet.clear([232, 237, 244, 255])
  for (const [index, props] of sheetMetalExamples.entries()) {
    const mesh = createSheetMetalMesh(props)
    for (const [row, eye] of [
      [42, -55, 45],
      [0, -65, 12],
    ].entries()) {
      const panel = new SoftwareRenderer(400, 400)
      panel.clear([232, 237, 244, 255])
      const draw = {
        positions: new Float32Array(mesh.positions),
        indices: new Uint32Array(mesh.indices),
        normals: null,
        uvs: null,
        model: mat4.create(),
        material: {
          baseColorFactor: [0.57, 0.65, 0.74, 1] as [
            number,
            number,
            number,
            number,
          ],
          baseColorTexture: null,
        },
      }
      panel.drawMesh(
        draw,
        {
          view: mat4.lookAt(
            mat4.create(),
            eye as [number, number, number],
            [0, 0, 5],
            [0, 0, 1],
          ),
          proj: mat4.ortho(mat4.create(), -24, 24, -24, 24, 0.1, 200),
        },
        { dir: [-0.4, 0.5, -0.8], ambient: 0.3 },
        draw.material,
        true,
        true,
      )
      for (let y = 0; y < 400; y++)
        sheet.bitmap.data.set(
          panel.bitmap.data.subarray(y * 400 * 4, (y + 1) * 400 * 4),
          ((row * 400 + y) * width + index * 400) * 4,
        )
    }
  }
  return encodePNG(sheet.bitmap)
}
