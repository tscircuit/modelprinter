import { expect, test } from "bun:test"
import {
  getWorkStopDimensions,
  modelDefinitionSchema,
  parseModelString,
  workStopModelPropsSchema,
} from "../src"

test("workstop resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "workstop_basel60mm_basew30mm_baset10mm_arm80mm_armd12mm_tip6mm_tiplen20mm_mountholes2_hole6.6mm_pitch40mm",
  )
  expect(parsed).toEqual({
    fn: "workstop",
    baseLength: 60,
    baseWidth: 30,
    baseThickness: 10,
    armLength: 80,
    armDiameter: 12,
    tipDiameter: 6,
    tipLength: 20,
    mountHoles: 2,
    holeDiameter: 6.6,
    holePitch: 40,
  })
  expect(getWorkStopDimensions().maxReach).toBeCloseTo(100, 6)
})

test("workstop supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "workstop_basel75mm_pitch52mm_arm110mm_tiplen25mm",
  )
  expect(parsed.fn).toBe("workstop")
  if (parsed.fn !== "workstop") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(workStopModelPropsSchema.parse({})).toBeDefined()
})

test("workstop rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("workstop_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("workstop_basel60mm_pitch56mm_hole6.6mm"),
  ).toThrow()
})
