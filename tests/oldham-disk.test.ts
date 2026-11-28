import { expect, test } from "bun:test"
import {
  getOldhamDiskDimensions,
  modelDefinitionSchema,
  oldhamDiskModelPropsSchema,
  parseModelString,
} from "../src"

test("oldhamdisk resolves 30x10mm orthogonal-tongue torque disk", () => {
  const parsed = parseModelString(
    "oldhamdisk_od30mm_w10mm_tonguew8mm_tongueh3mm_orthogonaltongues_floating",
  )
  expect(parsed).toEqual({
    fn: "oldhamdisk",
    outerDiameter: 30,
    width: 10,
    tongueWidth: 8,
    tongueHeight: 3,
    orthogonalTongues: true,
    floating: true,
  })
  expect(getOldhamDiskDimensions().webThickness).toBe(4)
})

test("oldhamdisk supports 40mm disk variant and schema roundtrip", () => {
  const parsed = parseModelString("oldhamdisk_od40mm_w14mm_tonguew10mm")
  expect(parsed.fn).toBe("oldhamdisk")
  if (parsed.fn !== "oldhamdisk") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(oldhamDiskModelPropsSchema.parse({}).floating).toBe(true)
})

test("oldhamdisk rejects legacy selectors and zero-thickness webs", () => {
  expect(() =>
    parseModelString("oldhamdisk_style(orthogonaltongues)"),
  ).toThrow()
  expect(() => parseModelString("oldhamdisk_w10mm_tongueh5mm")).toThrow()
})
