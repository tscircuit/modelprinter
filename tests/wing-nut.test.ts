import { expect, test } from "bun:test"
import {
  getWingNutDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  wingNutDimensions,
  wingNutModelDefinitionSchema,
  wingNutModelPropsSchema,
} from "../src"

test("wingnut resolves DIN 315 M4 through M12 rounded-wing envelopes", () => {
  const parsed = mp.string("wingnut_din315_m6_roundedwings").json()
  if (parsed.fn !== "wingnut") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "wingnut",
    din315: true,
    metricSize: "M6",
    roundedWings: true,
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("wingnut_m6").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wingNutModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("wingnut")

  for (const size of ["M4", "M5", "M6", "M8", "M10", "M12"] as const) {
    const resolved = getWingNutDimensions({ metricSize: size })
    const spec = wingNutDimensions[size]
    expect(resolved.wingSpan).toBe(spec.wingSpan)
    expect(resolved.bossTopZ).toBe(spec.bossHeight)
    expect(resolved.topZ).toBe(spec.height)
    expect(resolved.threadDepth).toBe(spec.bossHeight)
    expect(resolved.bearingZ).toBe(0)
  }
})

test("wingnut normalizes units, flags, case and schema roundtrips", () => {
  const m8 = mp
    .string(
      "WINGNUT_DIN315_M8_ROUNDEDWINGS_THREADPITCH0.125CM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m8.fn !== "wingnut") throw new Error("Unexpected model")
  expect(m8).toEqual({
    fn: "wingnut",
    din315: true,
    metricSize: "M8",
    roundedWings: true,
    threadPitch: 1.25,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m8
  expect(wingNutModelPropsSchema.parse(props)).toEqual(props)
})

test("wingnut rejects legacy selectors, duplicates and unsupported pitches or sizes", () => {
  for (const badStr of [
    "wingnut6",
    "wingnut",
    "wingnut_standard(din315)_m6",
    "wingnut_m6_wings(rounded)",
    "wingnut_m6_wings(rectangular)",
    "wingnut_din315(true)_m6",
    "wingnut_m6_roundedwings(true)",
    "wingnut_din315_din315_m6",
    "wingnut_m6_roundedwings_roundedwings",
    "wingnut_m3",
    "wingnut_m6_threadpitch1.25mm",
    "wingnut_m6_threads_nothreads",
    "wingnut_m6_threadclass(2B)",
    "wingnut_m6_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { metricSize: "M6", threadPitch: 0.75 },
    { metricSize: "M6", din315: false },
    { metricSize: "M6", roundedWings: false },
    { metricSize: "M6", standard: "din315" },
    { metricSize: "M6", wings: "rounded" },
  ]) {
    expect(wingNutModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
