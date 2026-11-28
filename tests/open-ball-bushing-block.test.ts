import { expect, test } from "bun:test"
import {
  getOpenBallBushingBlockDimensions,
  modelDefinitionSchema,
  openBallBushingBlockModelPropsSchema,
  parseModelString,
} from "../src"

test("openballbushingblock resolves SBR16UU 16mm open bearing block", () => {
  const parsed = parseModelString(
    "openballbushingblock_bore16mm_l50mm_w44mm_h33mm_openrecirculating_top4hole_holegrid(30mm,36mm)_m5",
  )
  expect(parsed).toEqual({
    fn: "openballbushingblock",
    boreDiameter: 16,
    length: 50,
    width: 44,
    height: 33,
    openRecirculating: true,
    top4Hole: true,
    holeGridX: 30,
    holeGridY: 36,
    thread: "m5",
  })

  const dims = getOpenBallBushingBlockDimensions()
  expect(dims.threadDiameter).toBe(5)
  expect(dims.mountingHoleCount).toBe(4)
})

test("openballbushingblock supports SBR20UU variant and roundtrips", () => {
  const parsed = parseModelString(
    "openballbushingblock_bore20mm_l5cm_w48mm_h39mm_holegrid(35mm,36mm)_M6",
  )
  expect(parsed.fn).toBe("openballbushingblock")
  if (parsed.fn !== "openballbushingblock") return
  expect(parsed.thread).toBe("m6")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(openBallBushingBlockModelPropsSchema.parse({}).openRecirculating).toBe(
    true,
  )
})

test("openballbushingblock rejects legacy selectors and overflowing hole grids", () => {
  expect(() =>
    parseModelString("openballbushingblock_style(openrecirculating)"),
  ).toThrow()
  expect(() =>
    parseModelString("openballbushingblock_l50mm_holegrid(48mm,36mm)_m5"),
  ).toThrow()
})
