import { expect, test } from "bun:test"
import {
  bobbinMountCoarsePitches,
  bobbinMountModelDefinitionSchema,
  bobbinMountModelPropsSchema,
  getBobbinMountDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("bobbinmount resolves cylindrical isolator body and dual M6 stud defaults", () => {
  const parsed = mp
    .string("bobbinmount_od25mm_h20mm_studd6mm_studl15mm_studstud_m6")
    .json()
  if (parsed.fn !== "bobbinmount") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "bobbinmount",
    outerDiameter: 25,
    height: 20,
    studDiameter: 6,
    studLength: 15,
    studStud: true,
    metricSize: "M6",
  })
  expect(mp.string("bobbinmount").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bobbinMountModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("bobbinmount")
  expect(bobbinMountCoarsePitches.M6).toBe(1)

  const dims = getBobbinMountDimensions()
  expect(dims.threadPitch).toBe(1)
  expect(dims.endPlateThickness).toBe(2)
  expect(dims.elastomerHeight).toBe(16)
  expect(dims.overallLength).toBe(50)
  expect(dims.lowerStudTipZ).toBe(-15)
  expect(dims.upperStudTipZ).toBe(35)
  expect(dims.size).toEqual([25, 25, 50])
})

test("bobbinmount normalizes units, infers studDiameter from metricSize and roundtrips", () => {
  const custom = mp
    .string(
      "BOBBINMOUNT_OUTERDIAMETER3CM_HEIGHT2.5CM_STUDLENGTH2CM_STUDSTUD_M8",
    )
    .json()
  if (custom.fn !== "bobbinmount") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "bobbinmount",
    outerDiameter: 30,
    height: 25,
    studDiameter: 8,
    studLength: 20,
    studStud: true,
    metricSize: "M8",
  })
  const { fn, ...props } = custom
  expect(bobbinMountModelPropsSchema.parse(props)).toEqual(props)
})

test("bobbinmount rejects legacy mount selectors, mismatched stud threads and invalid sizes", () => {
  for (const badStr of [
    "bobbinmount25",
    "bobbinmount_mount(studstud)",
    "bobbinmount_studstud(true)",
    "bobbinmount_studstud_studstud",
    "bobbinmount_m6_m8",
    "bobbinmount_studd8mm_m6",
    "bobbinmount_od6mm_m6",
    "bobbinmount_studl0.5mm_m6",
    "bobbinmount_m7",
    "bobbinmount_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { studDiameter: 8, metricSize: "M6" },
    { outerDiameter: 6, metricSize: "M6" },
    { studLength: 1, metricSize: "M6" },
    { studStud: false },
    { mount: "studstud" },
  ]) {
    expect(bobbinMountModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
