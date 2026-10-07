import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  timingPulleyModelPropsSchema,
  getTimingPulleyDimensions,
  parseTimingPulleyModelParams,
} from "../src"
const example =
  "timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm"
test("timingpulley canonical string, dimensions, units and registration", () => {
  const expected = {
    fn: "timingpulley",
    profile: "t5",
    toothCount: 20,
    beltWidth: 10,
    sideClearance: 1,
    boreDiameter: 5,
    flangeHeight: 2,
    flangeThickness: 1,
  } as const
  expect(mp.string(example).json()).toEqual(expected)
  expect(mp.string("timingpulley").json()).toEqual(expected)
  expect(
    mp
      .string(
        "TIMINGPULLEY_PROFILE(T5)_TOOTHCOUNT20_BELTWIDTH1cm_SIDECLEARANCE0.1cm_BOREDIAMETER0.005m_FLANGEHEIGHT2mm_FLANGETHICKNESS1mm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("timingpulley")
  const { fn, ...props } = expected
  expect(timingPulleyModelPropsSchema.parse(props)).toEqual(props)
  const d = getTimingPulleyDimensions(props)
  expect(d.pitchDiameter).toBeCloseTo(100 / Math.PI, 12)
  expect(d.outsideDiameter).toBeCloseTo(100 / Math.PI - 0.85, 12)
  expect(d.rootDiameter).toBeCloseTo(100 / Math.PI - 4.75, 12)
  expect(d.flangeDiameter).toBeCloseTo(d.outsideDiameter + 4, 12)
  expect(d.faceWidth).toBe(12)
  expect(d.totalWidth).toBe(14)
  expect([d.minZ, d.maxZ]).toEqual([-1, 13])
  expect(d.grooveAngle).toBe(50)
  expect(d.grooveOpening).toBe(3.32)
  expect(d.grooveDepth).toBe(1.95)
  expect(d.grooveRootRadius).toBe(0.4)
  expect(d.grooveEntryRadius).toBe(0.6)
  expect(d.toothPitchAngle).toBeCloseTo(Math.PI / 10, 12)
  expect(() =>
    parseTimingPulleyModelParams({ fn: "wrong", string: example }),
  ).toThrow()
})
