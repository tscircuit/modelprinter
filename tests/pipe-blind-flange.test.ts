import { expect, test } from "bun:test"
import {
  getPipeBlindFlangeDimensions,
  modelDefinitionSchema,
  parseModelString,
  pipeBlindFlangeModelPropsSchema,
} from "../src"

test("pipeblindflange resolves DN15 95x12mm 4-bolt blind flange", () => {
  const parsed = parseModelString(
    "pipeblindflange_od95mm_t12mm_boltcirc65mm_holes4_holed9mm_flatface_solidcenter",
  )
  expect(parsed).toEqual({
    fn: "pipeblindflange",
    outerDiameter: 95,
    thickness: 12,
    boltCircleDiameter: 65,
    holes: 4,
    holeDiameter: 9,
    flatFace: true,
    solidCenter: true,
  })
  expect(getPipeBlindFlangeDimensions().rimLigament).toBe(10.5)
})

test("pipeblindflange supports 8-bolt DN50 blind flange and roundtrips", () => {
  const parsed = parseModelString(
    "pipeblindflange_od165mm_t18mm_boltcirc125mm_holes8_holed18mm",
  )
  expect(parsed.fn).toBe("pipeblindflange")
  if (parsed.fn !== "pipeblindflange") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pipeBlindFlangeModelPropsSchema.parse({}).holes).toBe(4)
})

test("pipeblindflange rejects legacy selectors and rim-breaking bolt circles", () => {
  expect(() => parseModelString("pipeblindflange_face(flat)")).toThrow()
  expect(() =>
    parseModelString("pipeblindflange_od95mm_boltcirc90mm"),
  ).toThrow()
})
