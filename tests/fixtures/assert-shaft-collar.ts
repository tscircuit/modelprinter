import { expect } from "bun:test"
import {
  getShaftCollarDimensions,
  shaftCollarModelPropsSchema,
  shaftCollarModelDefinitionSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../../src"

const example = "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4"
const props = {
  boreDiameter: 8,
  outerDiameter: 16,
  width: 8,
  metricSize: "M4" as const,
}

export function assertShaftCollarContract() {
  const model = mp.string(example).json()
  if (model.fn !== "shaftcollar") throw new Error("Unexpected family")
  expect(model).toEqual({
    fn: "shaftcollar",
    boreDiameter: 8,
    outerDiameter: 16,
    width: 8,
    metricSize: "M4",
    mount: "setscrew",
    threadPitch: 0.7,
    threadHand: "right",
    threadClass: "6H",
    screwZ: 4,
    screwAngle: 0,
    chamfer: 0,
  })
  expect(mp.string(example).params()).toMatchObject({
    fn: "shaftcollar",
    bore: "8mm",
    m: "4",
  })
  expect(modelprinter.getModelNames()).toContain("shaftcollar")
  expect(shaftCollarModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(
    mp.string("SHAFTCOLLAR_BORE0.8CM_OD1.6CM_W0.8CM_MOUNT(SETSCREW)_M4").json(),
  ).toEqual(model)
  expect(
    shaftCollarModelPropsSchema.parse({
      ...props,
      boreDiameter: "0.31496062992125984in",
    }).boreDiameter,
  ).toBeCloseTo(8)
  expect(
    mp
      .string(example + "_threadpitch0.5mm_threadhand(left)_threadclass(6H)")
      .json(),
  ).toMatchObject({ threadPitch: 0.5, threadHand: "left", threadClass: "6H" })
  expect(
    shaftCollarModelPropsSchema.parse({ ...props, metricSize: "M2.5" })
      .threadPitch,
  ).toBe(0.45)
}

export function assertShaftCollarLayout() {
  const dimensions = getShaftCollarDimensions(props)
  expect(dimensions.wallThickness).toBe(4)
  expect(dimensions.screwHole).toMatchObject({
    start: [8, 0, 4],
    direction: [-1, -0, 0],
    diameter: 4,
    threadPitch: 0.7,
    threadHand: "right",
    threadGender: "female",
    threadClass: "6H",
  })
  const endpointX = dimensions.screwHole.start[0] - dimensions.screwHole.depth
  expect(endpointX ** 2 + (dimensions.screwHole.diameter / 2) ** 2).toBeCloseTo(
    4 ** 2,
  )
  const rotated = getShaftCollarDimensions({
    ...props,
    screwAngle: -270,
    screwZ: 5,
    chamfer: 0.2,
  }).screwHole
  expect(rotated.start[0]).toBeCloseTo(0)
  expect(rotated.start[1]).toBeCloseTo(8)
  expect(rotated.start[2]).toBe(5)
  expect(rotated.direction[0]).toBeCloseTo(0)
  expect(rotated.direction[1]).toBeCloseTo(-1)
  expect(
    mp.string(example + "_screwangle90deg_screwz5mm_chamfer0.2mm").json(),
  ).toMatchObject({ screwAngle: 90, screwZ: 5, chamfer: 0.2 })
}

export function assertShaftCollarValidation() {
  for (const source of [
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_typo1mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_bore9mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_m3",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_mount(unknown)",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadpitch4mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadhand(opposed)",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadclass(6g)",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadpitch0mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadpitch0.7oops",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadpitch1e-3mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_mountsetscrew",
    "shaftcollar_bore_od16mm_w8mm_mount(setscrew)_m4",
    "shaftcollar_bore0mm_od16mm_w8mm_mount(setscrew)_m4",
    "shaftcollar_bore20mm_od16mm_w8mm_mount(setscrew)_m4",
    "shaftcollar_bore8mmoops_od16mm_w8mm_mount(setscrew)_m4",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m7",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_threadpitch(0.7mm)",
    "shaftcollar(custom)_bore8mm_od16mm_w8mm_mount(setscrew)_m4",
    "shaftcollar",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_width9mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_screwz1mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_screwz7mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_chamfer2mm",
    "shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4_screwangle90rad",
    "shaftcollar_bore8mm_od16mm_w4mm_mount(setscrew)_m4",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const boreDiameter of [
    NaN,
    Infinity,
    -1,
    0,
    "8garbage",
    "(8mm)",
    true,
    1e200,
  ]) {
    expect(() =>
      shaftCollarModelPropsSchema.parse({ ...props, boreDiameter }),
    ).toThrow()
  }
  expect(() =>
    shaftCollarModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
  expect(() =>
    shaftCollarModelPropsSchema.parse({ ...props, outerDiameter: 1e200 }),
  ).toThrow()
}
