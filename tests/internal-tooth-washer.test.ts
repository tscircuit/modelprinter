import { expect, test } from "bun:test"
import {
  getInternalToothWasherDimensions,
  internalToothWasherModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("internaltoothwasher resolves DIN 6797J M6 10-tooth lock washer", () => {
  const parsed = parseModelString(
    "internaltoothwasher_id6.4mm_rootid9mm_od11mm_h0.8mm_teeth10_toothw1mm_twist15deg",
  )
  expect(parsed).toEqual({
    fn: "internaltoothwasher",
    innerDiameter: 6.4,
    rootInnerDiameter: 9,
    outerDiameter: 11,
    thickness: 0.8,
    teeth: 10,
    toothWidth: 1,
    twistAngle: 15,
  })
  expect(getInternalToothWasherDimensions().toothRadialLength).toBeCloseTo(
    1.3,
    6,
  )
})

test("internaltoothwasher supports M8 15mm OD variant and roundtrips", () => {
  const parsed = parseModelString(
    "internaltoothwasher_id8.4mm_rootid12mm_od15mm",
  )
  expect(parsed.fn).toBe("internaltoothwasher")
  if (parsed.fn !== "internaltoothwasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(internalToothWasherModelPropsSchema.parse({}).twistAngle).toBe(15)
})

test("internaltoothwasher rejects legacy selectors and inverted root diameters", () => {
  expect(() => parseModelString("internaltoothwasher_twist(15deg)")).toThrow()
  expect(() =>
    parseModelString("internaltoothwasher_rootid11mm_od11mm"),
  ).toThrow()
})
