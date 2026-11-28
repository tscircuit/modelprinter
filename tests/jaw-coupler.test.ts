import { expect, test } from "bun:test"
import {
  getJawCouplerDimensions,
  jawCouplerModelDefinitionSchema,
  jawCouplerModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("jawcoupler resolves three-jaw hubs, six-lobe spider and M4 set-screw defaults", () => {
  const parsed = mp
    .string("jawcoupler_bore8mm_od30mm_l40mm_jaws3_curvedjaw_setscrew_m4")
    .json()
  if (parsed.fn !== "jawcoupler") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "jawcoupler",
    boreDiameter: 8,
    boreBDiameter: 8,
    outerDiameter: 30,
    length: 40,
    jawCount: 3,
    curvedJaw: true,
    setScrew: true,
    metricSize: "M4",
    threadPitch: 0.7,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("jawcoupler").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(jawCouplerModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("jawcoupler")

  const dims = getJawCouplerDimensions()
  expect(dims.spiderLobeCount).toBe(6)
  expect(dims.spiderLength).toBe(10)
  expect(dims.hubBaseLength).toBe(15)
  expect(dims.setScrewDiameter).toBe(4)
  expect(dims.setScrewPositionsZ).toEqual([7.5, 32.5])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(40)
  expect(dims.size).toEqual([30, 30, 40])
})

test("jawcoupler normalizes unequal bores, units and schema roundtrips", () => {
  const custom = mp
    .string(
      "JAWCOUPLER_BOREDIAMETER6MM_BOREB10MM_OUTERDIAMETER3.2CM_LENGTH4.8CM_JAWCOUNT4_CURVEDJAW_SETSCREW_M5_THREADPITCH0.8MM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (custom.fn !== "jawcoupler") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "jawcoupler",
    boreDiameter: 6,
    boreBDiameter: 10,
    outerDiameter: 32,
    length: 48,
    jawCount: 4,
    curvedJaw: true,
    setScrew: true,
    metricSize: "M5",
    threadPitch: 0.8,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = custom
  expect(jawCouplerModelPropsSchema.parse(props)).toEqual(props)
})

test("jawcoupler rejects legacy style/mount selectors, duplicates and oversized bores", () => {
  for (const badStr of [
    "jawcoupler30",
    "jawcoupler_style(curvedjaw)",
    "jawcoupler_mount(setscrew)",
    "jawcoupler_curvedjaw(true)",
    "jawcoupler_setscrew(true)",
    "jawcoupler_curvedjaw_curvedjaw",
    "jawcoupler_bore29mm_od30mm",
    "jawcoupler_l10mm_m4",
    "jawcoupler_m4_threadpitch1mm",
    "jawcoupler_jaws1",
    "jawcoupler_threads_nothreads",
    "jawcoupler_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { boreDiameter: 29, outerDiameter: 30 },
    { length: 10, metricSize: "M4" },
    { curvedJaw: false },
    { style: "curvedjaw" },
  ]) {
    expect(jawCouplerModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
