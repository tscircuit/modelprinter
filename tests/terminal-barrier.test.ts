import { expect, test } from "bun:test"
import {
  getTerminalBarrierDimensions,
  modelDefinitionSchema,
  parseModelString,
  terminalBarrierModelPropsSchema,
} from "../src"

test("terminalbarrier resolves 4-station 8mm-pitch M3 barrier strip", () => {
  const parsed = parseModelString(
    "terminalbarrier_p8mm_n4_w40mm_d20mm_h15mm_screwm3_barriert2mm_holes2_hole3mm_hp32mm",
  )
  expect(parsed).toEqual({
    fn: "terminalbarrier",
    pitch: 8,
    poles: 4,
    width: 40,
    depth: 20,
    height: 15,
    screwThread: "m3",
    barrierThickness: 2,
    holes: 2,
    holeDiameter: 3,
    holePitch: 32,
  })

  const dims = getTerminalBarrierDimensions()
  expect(dims.cellWidth).toBe(6)
  expect(dims.activeBarrierSpan).toBe(34)
  expect(dims.topZ).toBe(15)
})

test("terminalbarrier supports 6-pole M4 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "terminalbarrier_p9.5mm_n6_w72mm_screwM4_hp64mm",
  )
  expect(parsed.fn).toBe("terminalbarrier")
  if (parsed.fn !== "terminalbarrier") return
  expect(parsed.screwThread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(terminalBarrierModelPropsSchema.parse({}).poles).toBe(4)
})

test("terminalbarrier rejects parenthesized selectors and overflowing hole pitches", () => {
  expect(() => parseModelString("terminalbarrier_mount(ears)_p8mm")).toThrow()
  expect(() =>
    parseModelString("terminalbarrier_w40mm_hp39mm_hole3mm"),
  ).toThrow()
})
