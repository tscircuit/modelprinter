import { expect, test } from "bun:test"
import {
  beltClampModelPropsSchema,
  getBeltClampDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("beltclamp resolves 20x30x10mm HTD 5M 2-hole clamp block", () => {
  const parsed = parseModelString(
    "beltclamp_w20mm_l30mm_h10mm_pitch5mm_htd5m_base2hole_holed4mm_holepitch20mm",
  )
  expect(parsed).toEqual({
    fn: "beltclamp",
    width: 20,
    length: 30,
    height: 10,
    pitch: 5,
    htd5m: true,
    base2Hole: true,
    holeDiameter: 4,
    holePitch: 20,
  })

  const dims = getBeltClampDimensions()
  expect(dims.toothCount).toBe(6)
  expect(dims.topZ).toBe(10)
})

test("beltclamp supports longer 40mm clamp variant and schema roundtrip", () => {
  const parsed = parseModelString("beltclamp_w25mm_l40mm_holepitch28mm")
  expect(parsed.fn).toBe("beltclamp")
  if (parsed.fn !== "beltclamp") return
  expect(parsed.length).toBe(40)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(beltClampModelPropsSchema.parse({}).htd5m).toBe(true)
})

test("beltclamp rejects legacy selectors and overflowing hole pitches", () => {
  expect(() =>
    parseModelString("beltclamp_profile(htd5m)_mount(base2hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("beltclamp_l30mm_holepitch28mm_holed4mm"),
  ).toThrow()
})
