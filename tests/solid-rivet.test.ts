import { expect, test } from "bun:test"
import {
  getSolidRivetDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  solidRivetModelDefinitionSchema,
  solidRivetModelPropsSchema,
  type SolidRivetModelDefinition,
} from "../src"

const required = { diameter: 3, length: 10, headDiameter: 5.5, headHeight: 2.2 }
const base = "solidrivet_d3mm_l10mm_headod5.5mm_headh2.2mm"

test("solid rivet roadmap example, flags, public schemas and registry agree", () => {
  const roadmap =
    "solidrivet_spec(custom)_d3mm_l10mm_head(round)_headod5.5mm_headh2.2mm_tail(flat)_state(unset)"
  const expected: SolidRivetModelDefinition = {
    fn: "solidrivet",
    ...required,
    specification: "custom",
    roundHead: true,
    flatTail: true,
    unset: true,
  }
  expect(mp.string(roadmap).json()).toEqual(expected)
  expect(mp.string(base).json()).toEqual(expected)
  expect(mp.string(`${base}_roundhead_flattail_unset`).json()).toEqual(expected)
  expect(mp.string(roadmap).params()).toMatchObject({
    fn: "solidrivet",
    d: "3mm",
    head: "(round)",
  })
  expect(parseModelString(roadmap)).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(solidRivetModelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("solidrivet")
})

test("solid rivet dimensions define the bearing circle and under-head length", () => {
  const dimensions = getSolidRivetDimensions(required)
  expect(dimensions.overallLength).toBeCloseTo(12.2)
  expect(dimensions.shankBottomZ).toBe(-10)
  expect(dimensions.headTopZ).toBe(2.2)
  expect(dimensions.headSphereRadius).toBeCloseTo(2.81875)
  expect(dimensions.headSphereCenterZ).toBeCloseTo(-0.61875)
  // Intersect the head sphere with Z=0 to recover the specified bearing circle.
  expect(
    2 *
      Math.sqrt(
        dimensions.headSphereRadius ** 2 - dimensions.headSphereCenterZ ** 2,
      ),
  ).toBeCloseTo(5.5)
  expect(
    dimensions.headSphereCenterZ + dimensions.headSphereRadius,
  ).toBeCloseTo(dimensions.headHeight)
  const hemisphere = getSolidRivetDimensions({ ...required, headHeight: 2.75 })
  expect(hemisphere.headSphereRadius).toBe(2.75)
  expect(hemisphere.headSphereCenterZ).toBe(0)
  const largeHemisphere = getSolidRivetDimensions({
    diameter: 1,
    length: 1,
    headDiameter: 1.6e308,
    headHeight: 8e307,
  })
  expect(largeHemisphere.headSphereRadius).toBe(8e307)
  expect(largeHemisphere.headSphereCenterZ).toBe(0)
})

test("solid rivet normalizes units and case without mutating props", () => {
  const props = Object.freeze({
    diameter: "0.3cm",
    length: "0.01m",
    headDiameter: "5.5MM",
    headHeight: "0.22cm",
  })
  expect(solidRivetModelPropsSchema.parse(props)).toMatchObject(required)
  expect(props.length).toBe("0.01m")
  expect(
    mp
      .string(
        "SOLIDRIVET_DIAMETER0.3CM_LENGTH0.01M_HEADDIAMETER5.5MM_HEADHEIGHT2.2MM_ROUNDHEAD_FLATTAIL_UNSET_SPEC(CUSTOM)",
      )
      .json(),
  ).toEqual(mp.string(base).json())
  const inches = getSolidRivetDimensions({
    diameter: "0.125in",
    length: "1in",
    headDiameter: "0.25in",
    headHeight: "0.1in",
  })
  expect(inches.diameter).toBeCloseTo(3.175)
  expect(inches.length).toBeCloseTo(25.4)
  expect(inches.overallLength).toBeCloseTo(27.94)
})

test("solid rivet rejects duplicate aliases, malformed tokens and unsupported constructions", () => {
  for (const suffix of [
    "d3mm",
    "diameter3mm",
    "l10mm",
    "length10mm",
    "headod5.5mm",
    "headdiameter5.5mm",
    "headh2.2mm",
    "headheight2.2mm",
    "roundhead_roundhead",
    "roundhead_head(round)",
    "head(round)_roundhead",
    "flattail_tail(flat)",
    "tail(flat)_flattail",
    "unset_state(unset)",
    "state(unset)_unset",
    "spec(custom)_spec(custom)",
    "roundhead1",
    "roundhead(true)",
    "flattail(false)",
    "unset0",
    "head(flat)",
    "head(round)junk",
    "head(round)(round)",
    "head",
    "tail(peened)",
    "state(set)",
    "spec(iso1051)",
    "specCUSTOM",
    "constructor1",
    "chamfer0.3mm",
    "unknown",
    "",
  ])
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  for (const source of [
    "solidrivet",
    "solidrivet_d3mm_l10mm_headod5.5mm",
    "solidrivet3_d3mm_l10mm_headod5.5mm_headh2.2mm",
    "solidrivet(3)_d3mm_l10mm_headod5.5mm_headh2.2mm",
    "solidrivet_d3mmjunk_l10mm_headod5.5mm_headh2.2mm",
    "solidrivet_d(3mm)_l10mm_headod5.5mm_headh2.2mm",
    "solidrivet_d3mm_l1e2_headod5.5mm_headh2.2mm",
    `${base}__unset`,
    `${base}_head(round`,
  ])
    expect(() => mp.string(source).json()).toThrow()
})

test("solid rivet validates every direct-schema and model-string dimension", () => {
  for (const property of ["diameter", "length", "headDiameter", "headHeight"]) {
    for (const value of [0, -1, Infinity, NaN, "3mmjunk", "1e2", ""]) {
      const props = { ...required, [property]: value }
      expect(() => solidRivetModelPropsSchema.parse(props)).toThrow()
      expect(() =>
        solidRivetModelDefinitionSchema.parse({ fn: "solidrivet", ...props }),
      ).toThrow()
      expect(() =>
        modelDefinitionSchema.parse({ fn: "solidrivet", ...props }),
      ).toThrow()
    }
  }
  for (const extra of [
    { headDiameter: 3 },
    { headDiameter: 2 },
    { headHeight: 2.751 },
    { roundHead: false },
    { flatTail: false },
    { unset: false },
    { specification: "standard" },
    { unknown: 1 },
    { diameter: 1, headDiameter: 1e308, headHeight: 1 },
    { diameter: 1, headDiameter: 1.6e308, headHeight: 8e307, length: 1.6e308 },
  ]) {
    expect(() =>
      solidRivetModelPropsSchema.parse({ ...required, ...extra }),
    ).toThrow()
    expect(() =>
      solidRivetModelDefinitionSchema.parse({
        fn: "solidrivet",
        ...required,
        ...extra,
      }),
    ).toThrow()
  }
  for (const source of [
    "solidrivet_d0_l10_headod5.5_headh2.2",
    "solidrivet_d3_l0_headod5.5_headh2.2",
    "solidrivet_d3_l10_headod3_headh1",
    "solidrivet_d3_l10_headod5.5_headh0",
    "solidrivet_d3_l10_headod5.5_headh3",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    getSolidRivetDimensions({ ...required, headHeight: 3 }),
  ).toThrow()
})
