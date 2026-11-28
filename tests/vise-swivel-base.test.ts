import { expect, test } from "bun:test"
import {
  getViseSwivelBaseDimensions,
  modelDefinitionSchema,
  parseModelString,
  viseSwivelBaseModelPropsSchema,
} from "../src"

test("viseswivelbase resolves 200mm rotary machine-vise turntable", () => {
  const parsed = parseModelString(
    "viseswivelbase_od200mm_h35mm_baset15mm_topod160mm_topt20mm_pilot80mm_piloth5mm_arcs2_arcpcd170mm_arcangle60deg_arcw12mm_topholes4_tophole10.5mm_pitchx100mm_pitchy60mm",
  )
  expect(parsed).toEqual({
    fn: "viseswivelbase",
    outerDiameter: 200,
    height: 35,
    baseThickness: 15,
    topOuterDiameter: 160,
    topThickness: 20,
    pilotDiameter: 80,
    pilotHeight: 5,
    arcs: 2,
    arcPcd: 170,
    arcAngle: 60,
    arcWidth: 12,
    topHoles: 4,
    topHoleDiameter: 10.5,
    pitchX: 100,
    pitchY: 60,
  })
  expect(getViseSwivelBaseDimensions().flangeRadialStep).toBe(20)
})

test("viseswivelbase supports 250mm 6-inch vise base and roundtrips", () => {
  const parsed = parseModelString(
    "viseswivelbase_od250mm_topod200mm_arcpcd215mm",
  )
  expect(parsed.fn).toBe("viseswivelbase")
  if (parsed.fn !== "viseswivelbase") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(viseSwivelBaseModelPropsSchema.parse({}).arcAngle).toBe(60)
})

test("viseswivelbase rejects rim-breaking arc slots and parenthesized tokens", () => {
  expect(() => parseModelString("viseswivelbase_scale(deg360)")).toThrow()
  expect(() => parseModelString("viseswivelbase_od200mm_arcpcd195mm")).toThrow()
})
