import { expect, test } from "bun:test"
import {
  getLinearCarriageDimensions,
  linearCarriageModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("linearcarriage resolves HGH15CA narrow profile carriage block", () => {
  const parsed = parseModelString(
    "linearcarriage_hgh15ca_railhgr15_w34mm_l61.4mm_assemblyh28mm_holegrid(26mm,26mm)_tappedholes_m4_threaddepth5mm",
  )
  expect(parsed).toEqual({
    fn: "linearcarriage",
    hgh15ca: true,
    railHgr15: true,
    width: 34,
    length: 61.4,
    assemblyHeight: 28,
    holeGridX: 26,
    holeGridY: 26,
    tappedHoles: true,
    thread: "m4",
    threadDepth: 5,
  })

  const dims = getLinearCarriageDimensions()
  expect(dims.carriageBodyHeight).toBeCloseTo(23.4)
  expect(dims.mountingHoleCount).toBe(4)
  expect(dims.topZ).toBe(28)
})

test("linearcarriage supports shorthand default string and schema roundtrip", () => {
  const parsed = parseModelString("linearcarriage_hgh15ca_M4")
  expect(parsed.fn).toBe("linearcarriage")
  if (parsed.fn !== "linearcarriage") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(linearCarriageModelPropsSchema.parse({}).railHgr15).toBe(true)
})

test("linearcarriage rejects legacy selectors and contradictory HGH15CA dimensions", () => {
  expect(() =>
    parseModelString("linearcarriage_series(hgh15ca)_rail(hgr15)"),
  ).toThrow()
  expect(() => parseModelString("linearcarriage_hgh15ca_w45mm")).toThrow()
  expect(() => parseModelString("linearcarriage_hgh15ca_m6")).toThrow()
})
