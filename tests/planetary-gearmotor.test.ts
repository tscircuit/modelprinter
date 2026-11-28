import { expect, test } from "bun:test"
import {
  getPlanetaryGearmotorDimensions,
  modelDefinitionSchema,
  parseModelString,
  planetaryGearmotorModelPropsSchema,
} from "../src"

test("planetarygearmotor resolves 50x140mm coaxial planetary gearmotor", () => {
  const parsed = parseModelString(
    "planetarygearmotor_motorod50mm_l140mm_shaftd12mm_face4hole_pcd40mm_m4_coaxial",
  )
  expect(parsed).toEqual({
    fn: "planetarygearmotor",
    motorOuterDiameter: 50,
    length: 140,
    shaftDiameter: 12,
    face4Hole: true,
    pcd: 40,
    mountThread: "m4",
    coaxial: true,
  })
  expect(getPlanetaryGearmotorDimensions().mountThreadMajorDiameter).toBe(4)
})

test("planetarygearmotor supports 36mm M3 gearmotor and roundtrips", () => {
  const parsed = parseModelString(
    "planetarygearmotor_motorod36mm_l95mm_shaftd8mm_pcd28mm_M3",
  )
  expect(parsed.fn).toBe("planetarygearmotor")
  if (parsed.fn !== "planetarygearmotor") return
  expect(parsed.mountThread).toBe("m3")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(planetaryGearmotorModelPropsSchema.parse({}).coaxial).toBe(true)
})

test("planetarygearmotor rejects legacy selectors and overflowing bolt circles", () => {
  expect(() =>
    parseModelString("planetarygearmotor_mount(face4hole)_style(coaxial)"),
  ).toThrow()
  expect(() =>
    parseModelString("planetarygearmotor_motorod50mm_pcd48mm_m4"),
  ).toThrow()
})
