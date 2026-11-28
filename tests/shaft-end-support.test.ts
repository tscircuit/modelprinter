import { expect, test } from "bun:test"
import {
  getShaftEndSupportDimensions,
  modelDefinitionSchema,
  parseModelString,
  shaftEndSupportModelPropsSchema,
} from "../src"

test("shaftendsupport resolves SK16 16mm upright split shaft support", () => {
  const parsed = parseModelString(
    "shaftendsupport_bore16mm_w40mm_h50mm_depth15mm_base2hole_holepitch30mm_holed5mm_clampm5",
  )
  expect(parsed).toEqual({
    fn: "shaftendsupport",
    boreDiameter: 16,
    width: 40,
    height: 50,
    depth: 15,
    base2Hole: true,
    holePitch: 30,
    holeDiameter: 5,
    clampThread: "m5",
  })
  expect(getShaftEndSupportDimensions().clampMajorDiameter).toBe(5)
})

test("shaftendsupport supports SK20 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "shaftendsupport_bore20mm_w48mm_h60mm_holepitch36mm_clampM6",
  )
  expect(parsed.fn).toBe("shaftendsupport")
  if (parsed.fn !== "shaftendsupport") return
  expect(parsed.clampThread).toBe("m6")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shaftEndSupportModelPropsSchema.parse({}).base2Hole).toBe(true)
})

test("shaftendsupport rejects legacy selectors and overflowing foot pitches", () => {
  expect(() => parseModelString("shaftendsupport_mount(base2hole)")).toThrow()
  expect(() =>
    parseModelString("shaftendsupport_w40mm_holepitch38mm_holed5mm"),
  ).toThrow()
})
