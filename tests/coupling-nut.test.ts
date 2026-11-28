import { expect, test } from "bun:test"
import {
  couplingNutDimensions,
  couplingNutModelDefinitionSchema,
  couplingNutModelPropsSchema,
  getCouplingNutDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

const source = "couplingnut_din6334_m6_l18mm_af10mm"

test("couplingnut resolves DIN 6334 M6 through M20 envelopes and dimensions", () => {
  const parsed = mp.string(source).json()
  if (parsed.fn !== "couplingnut") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "couplingnut",
    din6334: true,
    metricSize: "M6",
    length: 18,
    acrossFlats: 10,
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("couplingnut_m6").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(couplingNutModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("couplingnut")

  for (const size of ["M6", "M8", "M10", "M12", "M16", "M20"] as const) {
    const resolved = getCouplingNutDimensions({ metricSize: size })
    const spec = couplingNutDimensions[size]
    expect(resolved.length).toBe(spec.length)
    expect(resolved.acrossFlats).toBe(spec.acrossFlats)
    expect(resolved.bearingZ).toBe(0)
    expect(resolved.topZ).toBe(spec.length)
    expect(resolved.threadDepth).toBe(spec.length)
  }
})

test("couplingnut normalizes units, flags, case and roundtrips", () => {
  const m10 = mp
    .string(
      "COUPLINGNUT_DIN6334_M10_LENGTH3CM_ACROSSFLATS1.7CM_THREADPITCH1.5MM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m10.fn !== "couplingnut") throw new Error("Unexpected model")
  expect(m10).toEqual({
    fn: "couplingnut",
    din6334: true,
    metricSize: "M10",
    length: 30,
    acrossFlats: 17,
    threadPitch: 1.5,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m10
  expect(couplingNutModelPropsSchema.parse(props)).toEqual(props)
})

test("couplingnut rejects legacy selectors, duplicates and contradictory dimensions", () => {
  for (const badStr of [
    "couplingnut6",
    "couplingnut",
    "couplingnut_standard(din6334)_m6",
    "couplingnut_din6334(true)_m6",
    "couplingnut_din6334_din6334_m6",
    "couplingnut_m6_m6",
    "couplingnut_m5",
    "couplingnut_m6_l20mm",
    "couplingnut_m6_af11mm",
    "couplingnut_m6_threadpitch1.25mm",
    "couplingnut_m6_l18mm_length18mm",
    "couplingnut_m6_af10mm_acrossflats10mm",
    "couplingnut_m6_threads_nothreads",
    "couplingnut_m6_threadclass(2B)",
    "couplingnut_m6_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { metricSize: "M6", length: 20 },
    { metricSize: "M6", acrossFlats: 11 },
    { metricSize: "M6", threadPitch: 0.75 },
    { metricSize: "M6", din6334: false },
    { metricSize: "M6", standard: "din6334" },
  ]) {
    expect(couplingNutModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
