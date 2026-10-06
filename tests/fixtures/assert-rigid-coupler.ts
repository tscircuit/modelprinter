import { expect } from "bun:test"
import {
  getRigidCouplerDimensions,
  rigidCouplerModelPropsSchema,
  rigidCouplerModelDefinitionSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../../src"

const example =
  "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4"
const props = {
  boreDiameter: 8,
  outerDiameter: 20,
  length: 25,
  metricSize: "M4" as const,
}

export function assertRigidCouplerContract() {
  const model = mp.string(example).json()
  if (model.fn !== "rigidcoupler") throw new Error("Unexpected family")
  expect(model).toEqual({
    fn: "rigidcoupler",
    boreDiameter: 8,
    boreBDiameter: 8,
    outerDiameter: 20,
    length: 25,
    screwCount: 4,
    metricSize: "M4",
    mount: "setscrew",
    threadPitch: 0.7,
    threadHand: "right",
    threadClass: "6H",
    screwEndOffset: 6.25,
    screwAngle: 0,
    chamfer: 0,
  })
  expect(mp.string(example).params()).toMatchObject({
    fn: "rigidcoupler",
    bore: "8mm",
    m: "4",
  })
  expect(modelprinter.getModelNames()).toContain("rigidcoupler")
  expect(rigidCouplerModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(
    mp
      .string(
        "RIGIDCOUPLER_BORE0.8CM_OD2CM_L2.5CM_MOUNT(SETSCREW)_SCREWCOUNT4_M4",
      )
      .json(),
  ).toEqual(model)
  expect(
    rigidCouplerModelPropsSchema.parse({
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
    rigidCouplerModelPropsSchema.parse({ ...props, metricSize: "M2.5" })
      .threadPitch,
  ).toBe(0.45)
}

export function assertRigidCouplerLayout() {
  const dimensions = getRigidCouplerDimensions(props)
  expect(dimensions.boreADepth).toBe(12.5)
  expect(dimensions.boreBDepth).toBe(12.5)
  expect(dimensions.screwHoles).toHaveLength(4)
  const [a0, a90, b0, b90] = dimensions.screwHoles
  expect(a0).toMatchObject({
    start: [10, 0, 6.25],
    direction: [-1, -0, 0],
    diameter: 4,
    threadPitch: 0.7,
    threadHand: "right",
    threadGender: "female",
  })
  expect(b0?.start).toEqual([10, 0, 18.75])
  for (const hole of [a90!, b90!]) {
    expect(hole.start[0]).toBeCloseTo(0)
    expect(hole.start[1]).toBeCloseTo(10)
    expect(hole.direction[1]).toBeCloseTo(-1)
  }
  expect((10 - a0!.depth) ** 2 + 2 ** 2).toBeCloseTo(4 ** 2)
  const unequal = getRigidCouplerDimensions({
    ...props,
    boreBDiameter: 10,
    screwEndOffset: 5,
    screwAngle: 45,
  })
  expect(unequal.screwHoles[0]!.start[2]).toBe(5)
  expect(unequal.screwHoles[2]!.start[2]).toBe(20)
  expect(unequal.screwHoles[2]!.depth).toBeLessThan(
    unequal.screwHoles[0]!.depth,
  )
  expect(
    mp
      .string(
        example + "_boreb10mm_screwendoffset5mm_screwangle45deg_chamfer0.2mm",
      )
      .json(),
  ).toMatchObject({
    boreBDiameter: 10,
    screwEndOffset: 5,
    screwAngle: 45,
    chamfer: 0.2,
  })
}

export function assertRigidCouplerValidation() {
  for (const boreDiameter of [4.1, 5.6, Math.SQRT2 * 4]) {
    expect(() =>
      rigidCouplerModelPropsSchema.parse({ ...props, boreDiameter }),
    ).toThrow()
    expect(() =>
      rigidCouplerModelPropsSchema.parse({
        ...props,
        boreBDiameter: boreDiameter,
      }),
    ).toThrow()
  }
  expect(() =>
    rigidCouplerModelPropsSchema.parse({
      ...props,
      boreDiameter: 6,
      boreBDiameter: 6,
    }),
  ).not.toThrow()

  for (const source of [
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_typo1mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_bore9mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_m3",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_mount(unknown)",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadpitch4mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadhand(opposed)",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadclass(6g)",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadpitch0mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadpitch0.7oops",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadpitch1e-3mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_mountsetscrew",
    "rigidcoupler_bore_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore0mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore20mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore8mmoops_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m7",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_threadpitch(0.7mm)",
    "rigidcoupler(custom)_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler",
    "rigidcoupler_bore4.1mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore8mm_boreb5.6mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_length30mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_screwcount2",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_screwendoffset1mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_screwendoffset12mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_boreb20mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_boreb4mm",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4_screwangle90rad",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount3_m4",
    "rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4mm_m4",
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
      rigidCouplerModelPropsSchema.parse({ ...props, boreDiameter }),
    ).toThrow()
  }
  expect(() =>
    rigidCouplerModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
  expect(() =>
    rigidCouplerModelPropsSchema.parse({ ...props, outerDiameter: 1e200 }),
  ).toThrow()
}
