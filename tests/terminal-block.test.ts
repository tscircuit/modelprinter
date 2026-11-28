import { expect, test } from "bun:test"
import {
  getTerminalBlockDimensions,
  modelDefinitionSchema,
  parseModelString,
  terminalBlockModelPropsSchema,
} from "../src"

test("terminalblock resolves four-position 5mm PCB terminal block and pin array", () => {
  const parsed = parseModelString(
    "terminalblock_p5mm_n4_w20mm_d10mm_h12mm_wireid2.5mm_screwm2.5_throughhole_tails4mm",
  )
  expect(parsed).toEqual({
    fn: "terminalblock",
    pitch: 5,
    positions: 4,
    width: 20,
    depth: 10,
    height: 12,
    wireEntryDiameter: 2.5,
    screwThread: "m2.5",
    throughHole: true,
    tailLength: 4,
  })

  const dims = getTerminalBlockDimensions({ positions: 4 })
  expect(dims.width).toBeCloseTo(20)
  expect(dims.pinSpan).toBeCloseTo(15)
  expect(dims.pinPositionsX).toEqual([-7.5, -2.5, 2.5, 7.5])
  expect(dims.screwNominalDiameter).toBeCloseTo(2.5)
  expect(dims.endMargin).toBeCloseTo(2.5)
  expect(dims.bottomZ).toBe(-4)
  expect(dims.seatZ).toBe(0)
  expect(dims.topZ).toBe(12)
})

test("terminalblock defaults width from pitch * positions and roundtrips schema", () => {
  const parsed = parseModelString("terminalblock_p0.2in_n3_screwM3")
  expect(parsed.fn).toBe("terminalblock")
  if (parsed.fn !== "terminalblock") return
  expect(parsed.pitch).toBeCloseTo(5.08)
  expect(parsed.width).toBeCloseTo(15.24)
  expect(parsed.screwThread).toBe("m3")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(terminalBlockModelPropsSchema.parse({ positions: 2 }).width).toBe(10)
})

test("terminalblock rejects legacy selectors, narrow housings and oversized wire entries", () => {
  expect(() =>
    parseModelString(
      "terminalblock_p5mm_n4_w20mm_d10mm_h12mm_wireid2.5mm_screwm2.5_mount(throughhole)_tails4mm",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("terminalblock_p5mm_n4_w16mm_wireid2.5mm"),
  ).toThrow()
  expect(() => parseModelString("terminalblock_p5mm_n4_wireid5mm")).toThrow()
  expect(() => parseModelString("terminalblock_p5mm_n4_screwm6")).toThrow()
})
