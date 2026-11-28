import { expect, test } from "bun:test"
import {
  getShieldCanDimensions,
  modelDefinitionSchema,
  parseModelString,
  shieldCanModelPropsSchema,
} from "../src"

test("pcbshieldcan resolves 30x20x6mm 8-tab closed RF shield can", () => {
  const parsed = parseModelString(
    "pcbshieldcan_w30mm_d20mm_h6mm_t0.3mm_tabs8_tabw2mm_tabh1mm_closedtop",
  )
  expect(parsed).toEqual({
    fn: "pcbshieldcan",
    width: 30,
    depth: 20,
    height: 6,
    wallThickness: 0.3,
    tabs: 8,
    tabWidth: 2,
    tabHeight: 1,
    topStyle: "closedtop",
  })
  expect(getShieldCanDimensions().cavityWidth).toBeCloseTo(29.4, 6)
})

test("pcbshieldcan supports open-frame fence variant and roundtrips", () => {
  const parsed = parseModelString("pcbshieldcan_w40mm_d30mm_openframe")
  expect(parsed.fn).toBe("pcbshieldcan")
  if (parsed.fn !== "pcbshieldcan") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shieldCanModelPropsSchema.parse({}).tabs).toBe(8)
})

test("pcbshieldcan rejects odd tab counts and legacy selectors", () => {
  expect(() => parseModelString("pcbshieldcan_shape(closedtop)")).toThrow()
  expect(() => parseModelString("pcbshieldcan_tabs7")).toThrow()
})
