import { expect, test } from "bun:test"
import {
  channelNutModelPropsSchema,
  getChannelNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("channelnut resolves M6 20x35x8mm spring-loaded strut nut", () => {
  const parsed = parseModelString(
    "channelnut_m6_w20mm_l35mm_h8mm_grooves2_groovew3mm_groovedepth2mm_springod10mm_springl15mm_springwire1mm",
  )
  expect(parsed).toEqual({
    fn: "channelnut",
    threadDiameter: 6,
    width: 20,
    length: 35,
    height: 8,
    grooves: 2,
    grooveWidth: 3,
    grooveDepth: 2,
    springOuterDiameter: 10,
    springLength: 15,
    springWireDiameter: 1,
  })
  expect(getChannelNutDimensions().overallFreeHeight).toBe(23)
})

test("channelnut supports M10 long-spring strut nut and roundtrips", () => {
  const parsed = parseModelString("channelnut_m10_springl30mm")
  expect(parsed.fn).toBe("channelnut")
  if (parsed.fn !== "channelnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(channelNutModelPropsSchema.parse({}).grooves).toBe(2)
})

test("channelnut rejects legacy selectors and colliding thread bores", () => {
  expect(() => parseModelString("channelnut_spec(custom)")).toThrow()
  expect(() => parseModelString("channelnut_m16_w20mm_groovew3mm")).toThrow()
})
