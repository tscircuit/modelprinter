import { expect, test } from "bun:test"
import {
  coilInsertModelPropsSchema,
  getCoilInsertDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("coilinsert resolves M3x4.5mm 9-turn wire-thread insert", () => {
  const parsed = parseModelString(
    "coilinsert_custom_m3_l4.5mm_od3.7mm_turns9_diamond_wire0.35mm_benttang_sectionangle60deg",
  )
  expect(parsed).toEqual({
    fn: "coilinsert",
    custom: true,
    thread: "m3",
    length: 4.5,
    outerDiameter: 3.7,
    turns: 9,
    diamond: true,
    wireWidth: 0.35,
    bentTang: true,
    sectionAngle: 60,
  })

  const dims = getCoilInsertDimensions()
  expect(dims.freeInnerDiameter).toBeCloseTo(3.0)
  expect(dims.axialPitch).toBeCloseTo(0.5)
  expect(dims.topZ).toBe(4.5)
})

test("coilinsert supports M4 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "coilinsert_M4_l6mm_od4.9mm_turns8.5_wire0.45mm",
  )
  expect(parsed.fn).toBe("coilinsert")
  if (parsed.fn !== "coilinsert") return
  expect(parsed.thread).toBe("m4")
  expect(parsed.turns).toBe(8.5)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(coilInsertModelPropsSchema.parse({}).bentTang).toBe(true)
})

test("coilinsert rejects legacy selectors and oversized coil turns", () => {
  expect(() =>
    parseModelString("coilinsert_spec(custom)_section(diamond)_tang(bent)"),
  ).toThrow()
  expect(() => parseModelString("coilinsert_m3_od2.8mm")).toThrow()
  expect(() =>
    parseModelString("coilinsert_m3_l3mm_turns12_wire0.35mm"),
  ).toThrow()
})
