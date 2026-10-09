import { expect, test } from "bun:test"
import {
  ballTransferUnitDefaults,
  ballTransferUnitModelDefinitionSchema,
  ballTransferUnitModelPropsSchema,
  getBallTransferUnitDimensions,
  modelDefinitionSchema,
  mp,
  type BallTransferUnitModelDefinition,
  type ModelDefinition,
} from "../src"
import { ModelRegistry } from "../src/model-registry"
import { parseModelStringParams } from "../src/parse-model-string"
import { register } from "../src/models/balltransferunit/register"

test("balltransferunit roadmap and flag strings resolve to the complete contract", () => {
  const expected: BallTransferUnitModelDefinition = {
    fn: "balltransferunit",
    ...ballTransferUnitDefaults,
  }
  for (const source of [
    "balltransferunit",
    "balltransferunit_balld25mm_flangeod45mm_h30mm_mount(face3hole)_pcd36mm_holed4mm",
    "balltransferunit_balld25mm_flangeod45mm_h30mm_face3hole_pcd36mm_holed4mm",
    "BALLTRANSFERUNIT_BALLDIAMETER2.5CM_BODYDIAMETER3.1CM_HEIGHT3CM_BALLPROTRUSION7.5MM_FLANGEDIAMETER4.5CM_FLANGETHICKNESS3MM_PITCHCIRCLEDIAMETER3.6CM_HOLEDIAMETER4MM_SOCKETCLEARANCE0.25MM_FACE3HOLE",
  ]) {
    const definition = mp.string(source).json()
    if (definition.fn !== "balltransferunit")
      throw new Error("Expected ball transfer unit")
    expect(definition).toEqual(expected)
    expect(ballTransferUnitModelDefinitionSchema.parse(definition)).toEqual(
      definition,
    )
    expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  }
  expect(mp.getModelNames()).toContain("balltransferunit")
  expect(mp.string("balltransferunit_h30mm").params()).toMatchObject({
    fn: "balltransferunit",
    h: "30mm",
    string: "balltransferunit_h30mm",
  })
  const registry = new ModelRegistry()
  register(registry)
  expect(registry.parse(parseModelStringParams("balltransferunit"))).toEqual(
    expected,
  )
  const typed: ModelDefinition = ballTransferUnitModelDefinitionSchema.parse({
    fn: "balltransferunit",
  })
  if (typed.fn !== "balltransferunit") throw new Error("Expected ball unit")
  const narrowed: BallTransferUnitModelDefinition = typed
  expect(narrowed.faceThreeHole).toBe(true)
})

test("balltransferunit converts all lengths and preserves schema roundtrips", () => {
  const definition = mp
    .string(
      "balltransferunit_balld1in_bodyod1.3in_h1.3in_ballprotrusion0.3in_flangeod2in_flangethickness0.125in_pcd1.6in_holed0.125in_socketclearance10mil_face3hole",
    )
    .json()
  if (definition.fn !== "balltransferunit")
    throw new Error("Expected ball transfer unit")
  const expectedLengths = {
    ballDiameter: 25.4,
    bodyDiameter: 33.02,
    height: 33.02,
    ballProtrusion: 7.62,
    flangeDiameter: 50.8,
    flangeThickness: 3.175,
    pitchCircleDiameter: 40.64,
    holeDiameter: 3.175,
    socketClearance: 0.254,
  }
  for (const [key, value] of Object.entries(expectedLengths))
    expect(definition[key as keyof typeof expectedLengths]).toBeCloseTo(value)
  const { fn, ...props } = definition
  expect(ballTransferUnitModelPropsSchema.parse(props)).toEqual(props)
  expect(ballTransferUnitModelDefinitionSchema.parse({ fn, ...props })).toEqual(
    definition,
  )
  for (const [unit, value] of [
    ["mm", 30],
    ["cm", 3],
    ["m", 0.03],
    ["in", 30 / 25.4],
    ["inch", 30 / 25.4],
    ["mil", 30 / 0.0254],
    ["ft", 30 / 304.8],
    ["feet", 30 / 304.8],
  ] as const)
    expect(
      ballTransferUnitModelPropsSchema.parse({ height: `${value}${unit}` })
        .height,
    ).toBeCloseTo(30)
})

test("balltransferunit fixes the mounting datum, retaining opening and hole layout", () => {
  const d = getBallTransferUnitDimensions()
  expect(d.bodyHeight).toBe(22.5)
  expect(d.flangeBottomZ).toBe(19.5)
  expect(d.ballCenterZ).toBe(17.5)
  expect(d.ballCenterZ + d.ballRadius).toBe(30)
  expect(d.socketBottomZ).toBe(4.75)
  expect(d.openingRadius).toBeCloseTo(Math.sqrt(12.75 ** 2 - 5 ** 2))
  expect(d.openingRadius).toBeLessThan(d.ballRadius)
  expect(d.mountingHoles).toHaveLength(3)
  expect(d.mountingHoles[0]).toEqual({
    x: 18,
    y: 0,
    diameter: 4,
    z: 19.5,
    depth: 3,
  })
  expect(d.mountingHoles[1]!.x).toBeCloseTo(-9)
  expect(d.mountingHoles[1]!.y).toBeCloseTo(9 * Math.sqrt(3))
  expect(d.mountingHoles[2]!.x).toBeCloseTo(-9)
  expect(d.mountingHoles[2]!.y).toBeCloseTo(-9 * Math.sqrt(3))
  expect(
    getBallTransferUnitDimensions({ socketClearance: 0 }).socketRadius,
  ).toBe(d.ballRadius)
})
