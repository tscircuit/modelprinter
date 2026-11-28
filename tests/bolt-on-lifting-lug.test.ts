import { expect, test } from "bun:test"
import {
  boltOnLiftingLugModelPropsSchema,
  getBoltOnLiftingLugDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("boltonliftinglug resolves 100x80mm 25mm-eye gusseted padeye", () => {
  const parsed = parseModelString(
    "boltonliftinglug_basew100mm_based80mm_baset12mm_h90mm_lugw60mm_lugt15mm_eye25mm_eyez60mm_topr30mm_mounts4_hole11mm_pitchx80mm_pitchy60mm_gussets2_gussett8mm_gusseth45mm",
  )
  expect(parsed).toEqual({
    fn: "boltonliftinglug",
    baseWidth: 100,
    baseDepth: 80,
    baseThickness: 12,
    height: 90,
    lugWidth: 60,
    lugThickness: 15,
    eyeDiameter: 25,
    eyeZ: 60,
    topRadius: 30,
    mounts: 4,
    holeDiameter: 11,
    pitchX: 80,
    pitchY: 60,
    gussets: 2,
    gussetThickness: 8,
    gussetHeight: 45,
  })
  expect(getBoltOnLiftingLugDimensions().eyeCrownLigament).toBe(17.5)
})

test("boltonliftinglug supports 120x100mm heavy padeye and roundtrips", () => {
  const parsed = parseModelString("boltonliftinglug_basew120mm_based100mm")
  expect(parsed.fn).toBe("boltonliftinglug")
  if (parsed.fn !== "boltonliftinglug") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(boltOnLiftingLugModelPropsSchema.parse({}).mounts).toBe(4)
})

test("boltonliftinglug rejects thin shackle ligaments and parenthesized tokens", () => {
  expect(() => parseModelString("boltonliftinglug_grade(s355)")).toThrow()
  expect(() => parseModelString("boltonliftinglug_eye56mm_topr30mm")).toThrow()
})
