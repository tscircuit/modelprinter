import { expect, test } from "bun:test"
import {
  type FinnedHeatsinkModelDefinition,
  finnedHeatsinkModelPropsSchema,
  getFinnedHeatsinkDimensions,
  getFinnedHeatsinkMountingHoles,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

const source =
  "finnedheatsink_w40mm_l50mm_base3mm_h20mm_fins8_fint1mm_p5mm_holes2_hole3mm_hp40mm_longitudinal"

const expected: FinnedHeatsinkModelDefinition = {
  fn: "finnedheatsink",
  width: 40,
  length: 50,
  baseThickness: 3,
  height: 20,
  finCount: 8,
  finThickness: 1,
  finPitch: 5,
  holeCount: 2,
  holeDiameter: 3,
  holePitch: 40,
  longitudinal: true,
}

test("finnedheatsink contract, fin centers, mounting holes and registry", () => {
  const parsed = mp.string(source).json()
  expect(parsed).toEqual(expected)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("finnedheatsink")

  const { fn, ...props } = expected
  expect(finnedHeatsinkModelPropsSchema.parse(props)).toEqual(props)

  expect(getFinnedHeatsinkDimensions(props)).toMatchObject({
    finHeight: 17,
    channelWidth: 4,
    finCenterSpan: 35,
    outerFinSpan: 36,
    sideMargin: 2,
    holeEndMargin: 3.5,
    finCenters: [-17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5],
    size: [40, 50, 20],
    bottomZ: 0,
    finBaseZ: 3,
    topZ: 20,
  })

  expect(getFinnedHeatsinkMountingHoles(props)).toEqual([
    {
      center: { x: 0, y: -20, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
      diameter: 3,
      depth: 3,
    },
    {
      center: { x: 0, y: 20, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
      diameter: 3,
      depth: 3,
    },
  ])
})

test("finnedheatsink normalizes units, transverse flag, aliases and defaults", () => {
  expect(mp.string("finnedheatsink").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  const transverse = mp
    .string(
      "finnedheatsink_width5cm_length4cm_basethickness3mm_height2cm_fincount8_finthickness1mm_finpitch5mm_holecount2_holediameter3mm_holepitch4cm_transverse",
    )
    .json()
  expect(transverse).toEqual({
    ...expected,
    width: 50,
    length: 40,
    longitudinal: false,
  })
  expect(
    getFinnedHeatsinkMountingHoles({
      width: 50,
      length: 40,
      longitudinal: false,
    }),
  ).toEqual([
    {
      center: { x: -20, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
      diameter: 3,
      depth: 3,
    },
    {
      center: { x: 20, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
      diameter: 3,
      depth: 3,
    },
  ])
})

test("finnedheatsink rejects legacy selectors, odd fin collisions and invalid bounds", () => {
  for (const invalidStr of [
    "finnedheatsink40",
    "finnedheatsink_axis(longitudinal)",
    "finnedheatsink_longitudinal(true)",
    "finnedheatsink_longitudinal_transverse",
    `${source}_longitudinal`,
    `${source}_w40mm`,
    "finnedheatsink_fins7",
    "finnedheatsink_fins1",
    "finnedheatsink_fins8mm",
    "finnedheatsink_holes4",
    "finnedheatsink_base20mm_h20mm",
    "finnedheatsink_fint5mm_p5mm",
    "finnedheatsink_hole4mm_fint1mm_p5mm",
    "finnedheatsink_w35mm_fins8_fint1mm_p5mm",
    "finnedheatsink_l42mm_hp40mm_hole3mm",
    "finnedheatsink_hp2mm_hole3mm",
    "finnedheatsink_w",
    "finnedheatsink_unknown1",
  ]) {
    expect(() => mp.string(invalidStr).json()).toThrow()
  }

  for (const badProps of [
    { axis: "longitudinal" },
    { finCount: 7 },
    { holeCount: 4 },
    { baseThickness: 20, height: 20 },
    { width: 0 },
    { length: Number.NaN },
    { height: Number.POSITIVE_INFINITY },
  ]) {
    expect(finnedHeatsinkModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }
})
