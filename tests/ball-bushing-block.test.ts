import { expect, test } from "bun:test"
import {
  ballBushingBlockModelPropsSchema,
  getBallBushingBlockDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballbushingblock resolves SC8UU-style 8mm linear bushing block", () => {
  const parsed = parseModelString(
    "ballbushingblock_bore8mm_l30mm_w34mm_h22mm_closedrecirculating_top4hole_holegrid(18mm,24mm)_m4",
  )
  expect(parsed).toEqual({
    fn: "ballbushingblock",
    boreDiameter: 8,
    length: 30,
    width: 34,
    height: 22,
    closedRecirculating: true,
    top4Hole: true,
    holeGridX: 18,
    holeGridY: 24,
    thread: "m4",
  })

  const dims = getBallBushingBlockDimensions()
  expect(dims.centerHeight).toBe(11)
  expect(dims.threadDiameter).toBe(4)
  expect(dims.mountingHoleCount).toBe(4)
})

test("ballbushingblock supports 12mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "ballbushingblock_bore12mm_l36mm_w42mm_h28mm_holegrid(26mm,30.5mm)_M5",
  )
  expect(parsed.fn).toBe("ballbushingblock")
  if (parsed.fn !== "ballbushingblock") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballBushingBlockModelPropsSchema.parse({}).top4Hole).toBe(true)
})

test("ballbushingblock rejects legacy selectors and overflowing hole grids", () => {
  expect(() =>
    parseModelString(
      "ballbushingblock_bore8mm_style(closedrecirculating)_mount(top4hole)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("ballbushingblock_l30mm_w34mm_holegrid(28mm,24mm)_m4"),
  ).toThrow()
})
