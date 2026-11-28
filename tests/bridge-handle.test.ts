import { expect, test } from "bun:test"
import {
  bridgeHandleModelDefinitionSchema,
  bridgeHandleModelPropsSchema,
  getBridgeHandleDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("bridgehandle resolves rectangular bridge grip, feet and M5 tapped hole defaults", () => {
  const parsed = mp
    .string(
      "bridgehandle_pitch100mm_w20mm_h30mm_gript8mm_footsize(20mm,20mm)_holes2_m5",
    )
    .json()
  if (parsed.fn !== "bridgehandle") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "bridgehandle",
    pitch: 100,
    width: 20,
    height: 30,
    gripThickness: 8,
    footSize: [20, 20],
    holeCount: 2,
    metricSize: "M5",
    threadPitch: 0.8,
    rightHanded: true,
    threadClass: "6H",
    showThreads: true,
  })
  expect(mp.string("bridgehandle").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bridgeHandleModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("bridgehandle")

  const dims = getBridgeHandleDimensions()
  expect(dims.overallLength).toBe(120)
  expect(dims.overallWidth).toBe(20)
  expect(dims.innerSpan).toBe(80)
  expect(dims.underGripClearance).toBe(22)
  expect(dims.threadDiameter).toBe(5)
  expect(dims.threadDepth).toBe(10)
  expect(dims.holeCenters).toEqual([
    [-50, 0],
    [50, 0],
  ])
  expect(dims.mountingZ).toBe(0)
  expect(dims.topZ).toBe(30)
})

test("bridgehandle normalizes units, thread flags and schema roundtrips", () => {
  const m6 = mp
    .string(
      "BRIDGEHANDLE_P12CM_WIDTH22MM_HEIGHT4CM_GRIPTHICKNESS10MM_FOOTSIZE(2.4CM,2.4CM)_HOLECOUNT2_M6_THREADPITCH1MM_RIGHTHANDED_THREADCLASS(6h)_NOTHREADS",
    )
    .json()
  if (m6.fn !== "bridgehandle") throw new Error("Unexpected model")
  expect(m6).toEqual({
    fn: "bridgehandle",
    pitch: 120,
    width: 22,
    height: 40,
    gripThickness: 10,
    footSize: [24, 24],
    holeCount: 2,
    metricSize: "M6",
    threadPitch: 1,
    rightHanded: true,
    threadClass: "6H",
    showThreads: false,
  })
  const { fn, ...props } = m6
  expect(bridgeHandleModelPropsSchema.parse(props)).toEqual(props)
})

test("bridgehandle rejects overlapping feet, invalid threads and grip overhangs", () => {
  for (const badStr of [
    "bridgehandle100",
    "bridgehandle_p100mm_pitch100mm",
    "bridgehandle_h20mm_gript20mm",
    "bridgehandle_pitch20mm_footsize(20mm,20mm)",
    "bridgehandle_w25mm_footsize(20mm,20mm)",
    "bridgehandle_m5_threadpitch1mm",
    "bridgehandle_m12_h20mm",
    "bridgehandle_m12_footsize(12mm,20mm)",
    "bridgehandle_holes4",
    "bridgehandle_footsize(20mm)",
    "bridgehandle_threads_nothreads",
    "bridgehandle_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { pitch: 20, footSize: [20, 20] },
    { width: 25, footSize: [20, 20] },
    { metricSize: "M5", threadPitch: 1 },
    { rightHanded: false },
  ]) {
    expect(bridgeHandleModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
