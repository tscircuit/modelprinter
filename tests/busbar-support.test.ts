import { expect, test } from "bun:test"
import {
  busbarSupportModelPropsSchema,
  getBusbarSupportDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("busbarsupport resolves 35x25x30mm insulating saddle pedestal", () => {
  const parsed = parseModelString(
    "busbarsupport_w35mm_d25mm_h30mm_seatw15mm_seatd6mm_flange5mm_holes2_hole4mm_hp25mm_saddle",
  )
  expect(parsed).toEqual({
    fn: "busbarsupport",
    width: 35,
    depth: 25,
    height: 30,
    seatWidth: 15,
    seatDepth: 6,
    flangeThickness: 5,
    holes: 2,
    holeDiameter: 4,
    holePitch: 25,
    saddle: true,
  })
  expect(getBusbarSupportDimensions().seatFloorZ).toBe(24)
})

test("busbarsupport supports wider 50mm variant and schema roundtrip", () => {
  const parsed = parseModelString("busbarsupport_w50mm_seatw25mm_hp38mm")
  expect(parsed.fn).toBe("busbarsupport")
  if (parsed.fn !== "busbarsupport") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(busbarSupportModelPropsSchema.parse({}).saddle).toBe(true)
})

test("busbarsupport rejects legacy selectors and overflowing slots", () => {
  expect(() => parseModelString("busbarsupport_shape(saddle)")).toThrow()
  expect(() => parseModelString("busbarsupport_w35mm_seatw33mm")).toThrow()
})
