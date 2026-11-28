import { expect, test } from "bun:test"
import {
  getLevelingFootDimensions,
  levelingFootModelDefinitionSchema,
  levelingFootModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("levelingfoot resolves rigid flat circular pad and M8 stem defaults", () => {
  const parsed = mp
    .string("levelingfoot_od30mm_padh8mm_m8_steml27mm_swivel0deg_flatbase")
    .json()
  if (parsed.fn !== "levelingfoot") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "levelingfoot",
    padDiameter: 30,
    padHeight: 8,
    metricSize: "M8",
    stemLength: 27,
    swivelAngle: 0,
    flatBase: true,
    threadPitch: 1.25,
    rightHanded: true,
    threadClass: "6g",
    showThreads: true,
  })
  expect(mp.string("levelingfoot").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(levelingFootModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("levelingfoot")

  const dims = getLevelingFootDimensions()
  expect(dims.stemDiameter).toBe(8)
  expect(dims.overallHeight).toBe(35)
  expect(dims.shoulderAnnulusWidth).toBe(11)
  expect(dims.floorZ).toBe(0)
  expect(dims.padTopZ).toBe(8)
  expect(dims.topZ).toBe(35)
  expect(dims.size).toEqual([30, 30, 35])
})

test("levelingfoot normalizes units, aliases, flags and schema roundtrips", () => {
  const m10 = mp
    .string(
      "LEVELINGFOOT_PADDIAMETER4CM_PADHEIGHT1CM_M10_STEMLENGTH3.5CM_SWIVEL0_FLATBASE_THREADPITCH1.5MM_RIGHTHANDED_THREADCLASS(6G)_NOTHREADS",
    )
    .json()
  if (m10.fn !== "levelingfoot") throw new Error("Unexpected model")
  expect(m10).toEqual({
    fn: "levelingfoot",
    padDiameter: 40,
    padHeight: 10,
    metricSize: "M10",
    stemLength: 35,
    swivelAngle: 0,
    flatBase: true,
    threadPitch: 1.5,
    rightHanded: true,
    threadClass: "6g",
    showThreads: false,
  })
  const { fn, ...props } = m10
  expect(levelingFootModelPropsSchema.parse(props)).toEqual(props)
})

test("levelingfoot rejects legacy base selectors, non-zero swivel and invalid stem geometry", () => {
  for (const badStr of [
    "levelingfoot30",
    "levelingfoot_base(flat)",
    "levelingfoot_flatbase(true)",
    "levelingfoot_flatbase_flatbase",
    "levelingfoot_swivel15deg",
    "levelingfoot_od30mm_paddiameter30mm",
    "levelingfoot_od8mm_m8",
    "levelingfoot_m8_steml1mm",
    "levelingfoot_m8_threadpitch1mm",
    "levelingfoot_m8_threadclass(6H)",
    "levelingfoot_threads_nothreads",
    "levelingfoot_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { padDiameter: 8, metricSize: "M8" },
    { swivelAngle: 10 },
    { flatBase: false },
    { base: "flat" },
  ]) {
    expect(levelingFootModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
