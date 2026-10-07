import { expect, test } from "bun:test"
import {
  linearBearingBlockDefaults,
  linearBearingBlockModelPropsSchema,
  linearBearingBlockModelDefinitionSchema,
  getLinearBearingBlockDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("generic bearing block exact mounting datums, clearances and dimensions", () => {
  const source =
    "linearbearingblock_bore8mm_bearingod15mm_w34mm_l24mm_h24mm_mount(clearance)_hole4.5mm_pitchx24mm_pitchy16mm"
  expect(mp.string(source).json()).toEqual({
    fn: "linearbearingblock",
    ...linearBearingBlockDefaults,
  })
  expect(mp.string("linearbearingblock").json()).toEqual({
    fn: "linearbearingblock",
    ...linearBearingBlockDefaults,
  })
  const d = getLinearBearingBlockDimensions({})
  expect(d.shaftHeight).toBe(12)
  expect(d.mountingCenters).toEqual([
    [-12, -8],
    [12, -8],
    [12, 8],
    [-12, 8],
  ])
  expect(d.mountPitchX / 2 - d.mountHoleDiameter / 2 - d.cartridgeRadius).toBe(
    2.25,
  )
  expect(d.length / 2 - d.mountPitchY / 2 - d.mountHoleDiameter / 2).toBe(1.75)
  expect(d.height / 2 - d.cartridgeRadius).toBe(4.5)
  expect(d.endChamberRadius).toBeLessThan(d.cartridgeRadius)
  expect(d.returnRadius - d.ballRadius).toBeGreaterThan(d.boreRadius)
  expect(d.returnRadius).toBeLessThan(d.straightSleeveInnerRadius)
  expect(d.returnCageOuterRadius).toBeLessThan(d.returnRadius - d.ballRadius)
  expect(d.returnCageOuterRadius).toBeGreaterThan(d.cageInnerRadius)
  expect(d.loadedRadius - d.ballRadius).toBeCloseTo(d.boreRadius)
  const definition = mp.string(source).json()
  if (definition.fn !== "linearbearingblock")
    throw new Error("Expected linear bearing block")
  expect(linearBearingBlockModelDefinitionSchema.parse(definition)).toEqual(
    definition,
  )
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(
    mp.string(source.toUpperCase().replace("BORE8MM", "BORE0.8CM")).json(),
  ).toEqual(definition)
  expect(
    linearBearingBlockModelPropsSchema.parse({
      width: "3.4cm",
      length: "2.4cm",
      height: "2.4cm",
    }),
  ).toEqual(linearBearingBlockDefaults)
  expect(modelprinter.getModelNames()).toContain("linearbearingblock")
})
