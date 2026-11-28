import { expect, test } from "bun:test"
import {
  getPluggableTerminalDimensions,
  modelDefinitionSchema,
  parseModelString,
  pluggableTerminalModelPropsSchema,
} from "../src"

test("pluggableterminal resolves 4-pos 5.08mm female terminal plug", () => {
  const parsed = parseModelString(
    "pluggableterminal_p5.08mm_n4_w20.32mm_h12mm_d15mm_screwm2.5_frontwire_bottomfemale",
  )
  expect(parsed).toEqual({
    fn: "pluggableterminal",
    pitch: 5.08,
    poles: 4,
    width: 20.32,
    height: 12,
    depth: 15,
    screwThread: "m2.5",
    frontWire: true,
    bottomFemale: true,
  })
  expect(getPluggableTerminalDimensions().contactSpan).toBeCloseTo(15.24, 4)
})

test("pluggableterminal supports 8-pole 3.81mm plug and roundtrips", () => {
  const parsed = parseModelString(
    "pluggableterminal_p3.81mm_n8_w30.48mm_screwM2",
  )
  expect(parsed.fn).toBe("pluggableterminal")
  if (parsed.fn !== "pluggableterminal") return
  expect(parsed.screwThread).toBe("m2")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pluggableTerminalModelPropsSchema.parse({}).frontWire).toBe(true)
})

test("pluggableterminal rejects legacy selectors and undersized housings", () => {
  expect(() =>
    parseModelString("pluggableterminal_wire(front)_mate(bottomfemale)"),
  ).toThrow()
  expect(() => parseModelString("pluggableterminal_n6_w15mm")).toThrow()
})
