import { expect, test } from "bun:test"
import {
  capNutDimensions,
  capNutModelDefinitionSchema,
  capNutModelPropsSchema,
  getCapNutDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("capnut resolves DIN 1587 M4 through M12 envelopes and blind thread depths", () => {
  const parsed = mp.string("capnut_din1587_m6").json()
  if (parsed.fn !== "capnut") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "capnut",
    din1587: true,
    metricSize: "M6",
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("capnut_m6").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(capNutModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("capnut")

  for (const size of ["M4", "M5", "M6", "M8", "M10", "M12"] as const) {
    const resolved = getCapNutDimensions({ metricSize: size })
    const spec = capNutDimensions[size]
    expect(resolved.height).toBe(spec.height)
    expect(resolved.hexTopZ).toBe(spec.hexHeight)
    expect(resolved.topZ).toBe(spec.height)
    expect(resolved.threadDepth).toBe(spec.threadDepth)
    expect(resolved.bearingZ).toBe(0)
  }
})

test("capnut normalizes units, flags, case and schema roundtrips", () => {
  const m8 = mp
    .string(
      "CAPNUT_DIN1587_M8_THREADPITCH0.125CM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m8.fn !== "capnut") throw new Error("Unexpected model")
  expect(m8).toEqual({
    fn: "capnut",
    din1587: true,
    metricSize: "M8",
    threadPitch: 1.25,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m8
  expect(capNutModelPropsSchema.parse(props)).toEqual(props)
})

test("capnut rejects legacy selectors, duplicates and unsupported pitches or sizes", () => {
  for (const badStr of [
    "capnut6",
    "capnut",
    "capnut_standard(din1587)_m6",
    "capnut_din1587(true)_m6",
    "capnut_din1587_din1587_m6",
    "capnut_m6_m6",
    "capnut_m3",
    "capnut_m6_threadpitch1.25mm",
    "capnut_m6_threads_nothreads",
    "capnut_m6_threadclass(2B)",
    "capnut_m6_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { metricSize: "M6", threadPitch: 0.75 },
    { metricSize: "M6", din1587: false },
    { metricSize: "M6", standard: "din1587" },
  ]) {
    expect(capNutModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
