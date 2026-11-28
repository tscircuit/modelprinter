import { expect, test } from "bun:test"
import {
  getMasterChainLinkDimensions,
  masterChainLinkModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("masterchainlink resolves 12.7mm-pitch spring-clip connecting link", () => {
  const parsed = parseModelString(
    "masterchainlink_pitch12.7mm_w16mm_pind3.96mm_springclip_innerw7.85mm",
  )
  expect(parsed).toEqual({
    fn: "masterchainlink",
    pitch: 12.7,
    width: 16,
    pinDiameter: 3.96,
    springClip: true,
    innerWidth: 7.85,
  })
  expect(getMasterChainLinkDimensions().sideStackEach).toBeCloseTo(4.075, 4)
})

test("masterchainlink supports 15.875mm #50 link variant and roundtrips", () => {
  const parsed = parseModelString(
    "masterchainlink_pitch15.875mm_w20.3mm_pind5.08mm_innerw9.53mm",
  )
  expect(parsed.fn).toBe("masterchainlink")
  if (parsed.fn !== "masterchainlink") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(masterChainLinkModelPropsSchema.parse({}).springClip).toBe(true)
})

test("masterchainlink rejects legacy selectors and inverted widths", () => {
  expect(() => parseModelString("masterchainlink_style(springclip)")).toThrow()
  expect(() => parseModelString("masterchainlink_w12mm_innerw11mm")).toThrow()
})
