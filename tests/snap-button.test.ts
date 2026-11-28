import { expect, test } from "bun:test"
import {
  getSnapButtonDimensions,
  modelDefinitionSchema,
  parseModelString,
  snapButtonModelPropsSchema,
} from "../src"

test("snapbutton resolves 8mm Valco-style telescopic tube spring button", () => {
  const parsed = parseModelString(
    "snapbutton_buttond8mm_buttonh4mm_springw8mm_springth0.5mm_legl25mm_angle40deg_tubeid20mm",
  )
  expect(parsed).toEqual({
    fn: "snapbutton",
    buttonDiameter: 8,
    buttonHeight: 4,
    springWidth: 8,
    springThickness: 0.5,
    legLength: 25,
    legAngle: 40,
    tubeInnerDiameter: 20,
  })
  expect(getSnapButtonDimensions().freeSpreadHeight).toBeGreaterThan(15)
})

test("snapbutton supports 6mm button in 25mm tube and roundtrips", () => {
  const parsed = parseModelString("snapbutton_buttond6mm_tubeid25mm")
  expect(parsed.fn).toBe("snapbutton")
  if (parsed.fn !== "snapbutton") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(snapButtonModelPropsSchema.parse({}).legAngle).toBe(40)
})

test("snapbutton rejects legacy selectors and oversized buttons", () => {
  expect(() => parseModelString("snapbutton_angle(40deg)")).toThrow()
  expect(() => parseModelString("snapbutton_buttond8mm_tubeid10mm")).toThrow()
})
