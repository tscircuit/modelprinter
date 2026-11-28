import { expect, test } from "bun:test"
import {
  getViseJawDimensions,
  modelDefinitionSchema,
  parseModelString,
  viseJawModelPropsSchema,
} from "../src"

test("visejaw resolves 100x30x15mm stepped machine vise jaw", () => {
  const parsed = parseModelString(
    "visejaw_l100mm_h30mm_t15mm_holes2_hole6.6mm_pitch60mm_holez15mm_steph5mm_stepd5mm",
  )
  expect(parsed).toEqual({
    fn: "visejaw",
    length: 100,
    height: 30,
    thickness: 15,
    holes: 2,
    holeDiameter: 6.6,
    pitch: 60,
    holeZ: 15,
    stepHeight: 5,
    stepDepth: 5,
  })
  expect(getViseJawDimensions().lowerClampingHeight).toBe(25)
})

test("visejaw supports 6-inch 150mm jaw variant and schema roundtrip", () => {
  const parsed = parseModelString("visejaw_l150mm_h45mm_pitch98.4mm")
  expect(parsed.fn).toBe("visejaw")
  if (parsed.fn !== "visejaw") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(viseJawModelPropsSchema.parse({}).holes).toBe(2)
})

test("visejaw rejects parenthesized selectors and colliding step heights", () => {
  expect(() => parseModelString("visejaw_face(serrated)")).toThrow()
  expect(() => parseModelString("visejaw_h30mm_holez15mm_steph20mm")).toThrow()
})
