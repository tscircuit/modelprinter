import { expect, test } from "bun:test"
import {
  getHollowPositioningArmTubeDimensions,
  getHollowPositioningArmTubeFrame,
  hollowPositioningArmTubeModelPropsSchema,
  modelDefinitionSchema,
  mp,
} from "../src"

test("hollowpositioningarmtube defaults, full string and registry contract agree", () => {
  const source =
    "hollowpositioningarmtube_od6mm_id4mm_start38mm_end112mm_radius60mm_angle90_pitch2.25mm_depth0.25mm"
  const definition = mp.string(source).json()
  expect(definition).toEqual({
    fn: "hollowpositioningarmtube",
    outerDiameter: 6,
    innerDiameter: 4,
    startLength: 38,
    endLength: 112,
    bendRadius: 60,
    bendAngle: 90,
    ribPitch: 2.25,
    ribDepth: 0.25,
  })
  expect(mp.string("hollowpositioningarmtube").json()).toEqual(definition)
  expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
  expect(mp.getModelNames()).toContain("hollowpositioningarmtube")
  expect(mp.string(source).params()).toMatchObject({ od: "6mm", angle: "90" })
  expect(getHollowPositioningArmTubeDimensions({})).toEqual({
    bendLength: 30 * Math.PI,
    totalLength: 150 + 30 * Math.PI,
    rootDiameter: 5.5,
    minimumWallThickness: 0.75,
  })
})

test("hollowpositioningarmtube units, straight pose, pure bend and smooth tube", () => {
  expect(
    mp
      .string(
        "HOLLOWPOSITIONINGARMTUBE_OD0.6CM_ID0.4CM_START3.8CM_END11.2CM_RADIUS6CM",
      )
      .json(),
  ).toEqual(mp.string("hollowpositioningarmtube").json())
  expect(
    hollowPositioningArmTubeModelPropsSchema.parse({ startLength: "1in" })
      .startLength,
  ).toBe(25.4)
  expect(
    getHollowPositioningArmTubeFrame(
      { bendAngle: 0, startLength: 150, endLength: 0 },
      150,
    ),
  ).toEqual({ position: [0, 0, 150], tangent: [0, 0, 1], normal: [1, 0, -0] })
  const input = { startLength: 0, endLength: 0, bendAngle: 180, ribDepth: 0 }
  const frame = getHollowPositioningArmTubeFrame(
    input,
    getHollowPositioningArmTubeDimensions(input).totalLength,
  )
  expect(frame.position[0]).toBeCloseTo(120)
  expect(frame.position[2]).toBeCloseTo(0)
  expect(frame.tangent[2]).toBeCloseTo(-1)
  expect(
    getHollowPositioningArmTubeDimensions(input).minimumWallThickness,
  ).toBe(1)
})

test("hollowpositioningarmtube mounting datums and section frames follow the circular arc", () => {
  const length = getHollowPositioningArmTubeDimensions({}).totalLength
  for (const [s, expected] of [
    [0, [0, 0, 0]],
    [38, [0, 0, 38]],
    [38 + 30 * Math.PI, [60, 0, 98]],
    [length, [172, 0, 98]],
  ] as const) {
    const frame = getHollowPositioningArmTubeFrame({}, s)
    frame.position.forEach((value, axis) =>
      expect(value).toBeCloseTo(expected[axis]!),
    )
    expect(Math.hypot(...frame.normal)).toBeCloseTo(1)
    expect(Math.hypot(...frame.tangent)).toBeCloseTo(1)
    expect(
      frame.normal.reduce(
        (dot, value, axis) => dot + value * frame.tangent[axis]!,
        0,
      ),
    ).toBeCloseTo(0)
  }
  const middle = getHollowPositioningArmTubeFrame({}, 38 + 15 * Math.PI)
  expect(middle.position[0]).toBeCloseTo(60 * (1 - Math.SQRT1_2))
  expect(middle.position[2]).toBeCloseTo(38 + 60 * Math.SQRT1_2)
  for (const join of [38, 38 + 30 * Math.PI]) {
    const before = getHollowPositioningArmTubeFrame({}, join - 1e-6)
    const after = getHollowPositioningArmTubeFrame({}, join + 1e-6)
    expect(
      Math.hypot(...before.position.map((v, i) => v - after.position[i]!)),
    ).toBeCloseTo(2e-6, 8)
    before.tangent.forEach((v, i) =>
      expect(v).toBeCloseTo(after.tangent[i]!, 6),
    )
  }
})

test("hollowpositioningarmtube rejects invalid dimensions, duplicated tokens and unsupported poses", () => {
  for (const token of [
    "od4mm",
    "id6mm",
    "id0mm",
    "depth1mm",
    "depth-1mm",
    "pitch0mm",
    "radius3mm",
    "angle181",
    "angle90deg",
    "angle-1",
    "start-1mm",
    "od6mm_od7mm",
    "angle90_angle90",
    "start38mmjunk",
    "hollow",
    "od",
    "foo1mm",
  ])
    expect(() =>
      mp.string(`hollowpositioningarmtube_${token}`).json(),
    ).toThrow()
  expect(() => mp.string("hollowpositioningarmtube6").json()).toThrow()
  for (const input of [
    { bendAngle: 0, startLength: 0, endLength: 0 },
    { startLength: NaN },
    { outerDiameter: Infinity },
    { bendAngle: NaN },
    { startLength: 1.7e308, endLength: 1.7e308 },
    { bendRadius: 1.7e308, bendAngle: 180 },
    { unknown: 1 },
  ])
    expect(() =>
      hollowPositioningArmTubeModelPropsSchema.parse(input),
    ).toThrow()
  for (const s of [-1, Infinity, NaN, 250])
    expect(() => getHollowPositioningArmTubeFrame({}, s)).toThrow()
})
