import { createSheetMetalMesh, mp } from "../../src"
import { sheetMetalExamples } from "./sheet-metal-examples"
import { renderModelSnapshot } from "./render-model-snapshot"

const modelStrings = [
  "sheetmetal_plate_w24mm_l28mm_t1mm_r1mm",
  "sheetmetal_angle_w24mm_l20mm_h16mm_t1.2mm_r2mm",
  "sheetmetal_channel_w28mm_l24mm_h14mm_t1mm_r2mm",
] as const

export function renderSheetMetalSnapshot(index: 0 | 1 | 2) {
  const modelString = modelStrings[index]
  const definition = mp.string(modelString).json()
  if (definition.fn !== "sheetmetal") throw new Error("Expected sheet metal")
  const { fn, ...props } = definition
  return renderModelSnapshot({
    mesh: createSheetMetalMesh({
      ...props,
      holes: sheetMetalExamples[index]!.holes,
    }),
    title: `SHEET METAL / ${definition.profile.toUpperCase()}`,
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "FORMED PANELS AND CUTOUTS",
        eye: [42, -55, 45],
        target: [0, 0, 5],
        span: 44,
      },
      {
        name: "TOP",
        detail: "BASE PANEL CUTOUTS",
        eye: [0, 0, 70],
        target: [0, 0, 0],
        span: 44,
      },
      {
        name: "FRONT",
        detail: "CONSTANT THICKNESS AND BEND RADII",
        eye: [0, -65, 8],
        target: [0, 0, 8],
        span: 44,
      },
      {
        name: "RIGHT",
        detail: "FLANGE PROFILE AND CUTOUTS",
        eye: [65, 0, 8],
        target: [0, 0, 8],
        span: 44,
      },
    ],
    footer:
      "POPPYGL / DIMENSIONS IN mm / PANEL CUTOUTS SUPPLIED AS TYPED HOLES PROPS",
  })
}
