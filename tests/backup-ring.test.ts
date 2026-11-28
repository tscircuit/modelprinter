import { expect, test } from "bun:test"
import {
  backupRingModelPropsSchema,
  getBackupRingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("backupring resolves 20x24x1mm 45-deg scarf-cut backup ring", () => {
  const parsed = parseModelString(
    "backupring_id20mm_od24mm_t1mm_rectangular_splitangle45deg_splitgap0.5mm",
  )
  expect(parsed).toEqual({
    fn: "backupring",
    innerDiameter: 20,
    outerDiameter: 24,
    thickness: 1,
    rectangular: true,
    splitAngleDeg: 45,
    splitGap: 0.5,
  })
  expect(getBackupRingDimensions().radialWidth).toBe(2)
})

test("backupring supports 30deg split variant and schema roundtrip", () => {
  const parsed = parseModelString("backupring_id30mm_od35mm_splitangle30deg")
  expect(parsed.fn).toBe("backupring")
  if (parsed.fn !== "backupring") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(backupRingModelPropsSchema.parse({}).rectangular).toBe(true)
})

test("backupring rejects legacy selectors and out-of-range split angles", () => {
  expect(() => parseModelString("backupring_profile(rectangular)")).toThrow()
  expect(() => parseModelString("backupring_splitangle90deg")).toThrow()
})
