import { expect, test } from "bun:test"
import {
  getWireSpliceDimensions,
  modelDefinitionSchema,
  parseModelString,
  wireSpliceModelPropsSchema,
} from "../src"

test("wiresplice resolves 3-way 18x12x20mm lever splice connector", () => {
  const parsed = parseModelString(
    "wiresplice_w18mm_h12mm_d20mm_ports3_portid3mm_portp5mm_levers3_snapbracket",
  )
  expect(parsed).toEqual({
    fn: "wiresplice",
    width: 18,
    height: 12,
    depth: 20,
    ports: 3,
    portInnerDiameter: 3,
    portPitch: 5,
    levers: 3,
    snapBracket: true,
  })
  expect(getWireSpliceDimensions().portSpan).toBe(10)
})

test("wiresplice supports 5-way 29mm-wide splice and roundtrips", () => {
  const parsed = parseModelString("wiresplice_w29mm_ports5_levers5")
  expect(parsed.fn).toBe("wiresplice")
  if (parsed.fn !== "wiresplice") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wireSpliceModelPropsSchema.parse({}).ports).toBe(3)
})

test("wiresplice rejects mismatched lever counts and legacy selectors", () => {
  expect(() => parseModelString("wiresplice_mount(snapbracket)")).toThrow()
  expect(() => parseModelString("wiresplice_ports5_levers3")).toThrow()
})
