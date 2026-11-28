import { expect, test } from "bun:test"
import {
  getRelayBaseDimensions,
  modelDefinitionSchema,
  parseModelString,
  relayBaseModelPropsSchema,
} from "../src"

test("relaybase resolves 8-pin octal TH35x7.5 DIN relay socket", () => {
  const parsed = parseModelString(
    "relaybase_w25mm_d40mm_h20mm_socketpins8_socketpcd11mm_th35x7.5_sidescrewterminals_screwm3",
  )
  expect(parsed).toEqual({
    fn: "relaybase",
    width: 25,
    depth: 40,
    height: 20,
    socketPins: 8,
    socketPcd: 11,
    th35x75: true,
    sideScrewTerminals: true,
    screwThread: "m3",
  })

  const dims = getRelayBaseDimensions()
  expect(dims.dinRailWidth).toBe(35)
  expect(dims.screwMajorDiameter).toBe(3)
})

test("relaybase supports 11-pin undecal variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "relaybase_w38mm_d45mm_socketpins11_socketpcd12mm_screwM3.5",
  )
  expect(parsed.fn).toBe("relaybase")
  if (parsed.fn !== "relaybase") return
  expect(parsed.socketPins).toBe(11)
  expect(parsed.screwThread).toBe("m3.5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(relayBaseModelPropsSchema.parse({}).th35x75).toBe(true)
})

test("relaybase rejects legacy parenthesized selectors and undersized depths", () => {
  expect(() =>
    parseModelString("relaybase_rail(TH35x7.5)_terminals(sidescrew)"),
  ).toThrow()
  expect(() => parseModelString("relaybase_d30mm")).toThrow()
})
