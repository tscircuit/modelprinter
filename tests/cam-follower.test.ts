import { expect, test } from "bun:test"
import {
  camFollowerModelDefinitionSchema,
  camFollowerModelPropsSchema,
  getCamFollowerDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("camfollower resolves needle-roller outer race and M10 stud defaults", () => {
  const parsed = mp
    .string(
      "camfollower_od22mm_w12mm_studd10mm_studl20mm_needlebearing_studmount_m10",
    )
    .json()
  if (parsed.fn !== "camfollower") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "camfollower",
    outerDiameter: 22,
    width: 12,
    studDiameter: 10,
    studLength: 20,
    needleBearing: true,
    studMount: true,
    metricSize: "M10",
    threadPitch: 1.5,
    rightHanded: true,
    threadClass: "6g",
    showThreads: true,
  })
  expect(mp.string("camfollower").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(camFollowerModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("camfollower")

  const dims = getCamFollowerDimensions()
  expect(dims.overallLength).toBe(32)
  expect(dims.radialSection).toBe(6)
  expect(dims.studTipZ).toBe(-20)
  expect(dims.shoulderZ).toBe(0)
  expect(dims.headTopZ).toBe(12)
  expect(dims.size).toEqual([22, 22, 32])
})

test("camfollower normalizes units, studd inference and schema roundtrips", () => {
  const m12 = mp
    .string(
      "CAMFOLLOWER_OUTERDIAMETER3CM_WIDTH1.4CM_STUDLENGTH2.5CM_NEEDLEBEARING_STUDMOUNT_M12_THREADPITCH1.75MM_RIGHTHANDED_THREADCLASS(6G)_NOTHREADS",
    )
    .json()
  if (m12.fn !== "camfollower") throw new Error("Unexpected model")
  expect(m12).toEqual({
    fn: "camfollower",
    outerDiameter: 30,
    width: 14,
    studDiameter: 12,
    studLength: 25,
    needleBearing: true,
    studMount: true,
    metricSize: "M12",
    threadPitch: 1.75,
    rightHanded: true,
    threadClass: "6g",
    showThreads: false,
  })
  const { fn, ...props } = m12
  expect(camFollowerModelPropsSchema.parse(props)).toEqual(props)
})

test("camfollower rejects legacy selectors, mismatched stud diameters and thin races", () => {
  for (const badStr of [
    "camfollower22",
    "camfollower_bearing(needle)",
    "camfollower_mount(stud)",
    "camfollower_needlebearing(true)",
    "camfollower_studmount(true)",
    "camfollower_needlebearing_needlebearing",
    "camfollower_studmount_studmount",
    "camfollower_studd8mm_m10",
    "camfollower_od12mm_m10",
    "camfollower_m10_studl1mm",
    "camfollower_m10_threadpitch1.25mm",
    "camfollower_m10_threadclass(6H)",
    "camfollower_threads_nothreads",
    "camfollower_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { metricSize: "M10", studDiameter: 8 },
    { outerDiameter: 12, metricSize: "M10" },
    { needleBearing: false },
    { bearing: "needle" },
  ]) {
    expect(camFollowerModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
