import { expect, test } from "bun:test"
import {
  getYokeFollowerDimensions,
  modelDefinitionSchema,
  parseModelString,
  yokeFollowerModelPropsSchema,
} from "../src"

test("yokefollower resolves 10x30x14mm needle yoke cam follower", () => {
  const parsed = parseModelString(
    "yokefollower_bore10mm_od30mm_w14mm_rows1_needle_open_boremount",
  )
  expect(parsed).toEqual({
    fn: "yokefollower",
    boreDiameter: 10,
    outerDiameter: 30,
    width: 14,
    rows: 1,
    needleBearing: true,
    closure: "open",
    boreMount: true,
  })
  expect(getYokeFollowerDimensions().radialSection).toBe(10)
})

test("yokefollower supports sealed 35mm variant and roundtrips", () => {
  const parsed = parseModelString("yokefollower_od35mm_sealed")
  expect(parsed.fn).toBe("yokefollower")
  if (parsed.fn !== "yokefollower") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(yokeFollowerModelPropsSchema.parse({}).outerDiameter).toBe(30)
})

test("yokefollower rejects thin outer rings and legacy selectors", () => {
  expect(() => parseModelString("yokefollower_bearing(needle)")).toThrow()
  expect(() => parseModelString("yokefollower_bore25mm_od30mm")).toThrow()
})
