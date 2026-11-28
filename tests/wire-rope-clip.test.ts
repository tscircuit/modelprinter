import { expect, test } from "bun:test"
import {
  getWireRopeClipDimensions,
  modelDefinitionSchema,
  parseModelString,
  wireRopeClipModelPropsSchema,
} from "../src"

test("wireropeclip resolves 6mm-cable M6 U-bolt wire rope clip", () => {
  const parsed = parseModelString(
    "wireropeclip_roped6mm_uboltd6mm_m6_legpitch18mm_legl30mm_saddlew25mm_saddlel15mm_saddleh8mm_groover3mm_hexnuts_assembled",
  )
  expect(parsed).toEqual({
    fn: "wireropeclip",
    ropeDiameter: 6,
    uBoltDiameter: 6,
    threadDiameter: 6,
    legPitch: 18,
    legLength: 30,
    saddleWidth: 25,
    saddleLength: 15,
    saddleHeight: 8,
    grooveRadius: 3,
    hexNuts: true,
    assembled: true,
  })
  expect(getWireRopeClipDimensions().clearBetweenLegs).toBe(12)
})

test("wireropeclip supports 10mm-cable M8 clip and roundtrips", () => {
  const parsed = parseModelString(
    "wireropeclip_roped10mm_uboltd8mm_m8_legpitch24mm_saddlew34mm_saddleh12mm_groover5mm",
  )
  expect(parsed.fn).toBe("wireropeclip")
  if (parsed.fn !== "wireropeclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wireRopeClipModelPropsSchema.parse({}).ropeDiameter).toBe(6)
})

test("wireropeclip rejects legacy selectors and pinched cable legs", () => {
  expect(() => parseModelString("wireropeclip_nuts(hex)")).toThrow()
  expect(() =>
    parseModelString("wireropeclip_roped10mm_uboltd6mm_legpitch14mm"),
  ).toThrow()
})
