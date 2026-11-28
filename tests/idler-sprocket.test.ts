import { expect, test } from "bun:test"
import {
  getIdlerSprocketDimensions,
  idlerSprocketModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("idlersprocket resolves 12T 12.7mm-pitch chain idler sprocket", () => {
  const parsed = parseModelString(
    "idlersprocket_teeth12_pitch12.7mm_bore8mm_toothw7.2mm_rollerd7.92mm_tipod55mm_rootod41.2mm_strands1_rollerpocket_bearingbore",
  )
  expect(parsed).toEqual({
    fn: "idlersprocket",
    teeth: 12,
    pitch: 12.7,
    boreDiameter: 8,
    toothWidth: 7.2,
    rollerDiameter: 7.92,
    tipOuterDiameter: 55,
    rootOuterDiameter: 41.2,
    strands: 1,
    rollerPocket: true,
    bearingBore: true,
  })
  expect(getIdlerSprocketDimensions().pitchDiameter).toBeGreaterThan(48)
})

test("idlersprocket supports 15T 10mm-bore sprocket and roundtrips", () => {
  const parsed = parseModelString(
    "idlersprocket_teeth15_bore10mm_rootod53mm_tipod67mm",
  )
  expect(parsed.fn).toBe("idlersprocket")
  if (parsed.fn !== "idlersprocket") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(idlerSprocketModelPropsSchema.parse({}).teeth).toBe(12)
})

test("idlersprocket rejects legacy selectors and inverted root/tip diameters", () => {
  expect(() => parseModelString("idlersprocket_mount(bearingbore)")).toThrow()
  expect(() => parseModelString("idlersprocket_rootod55mm_tipod55mm")).toThrow()
})
