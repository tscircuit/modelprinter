import { expect } from "bun:test"
import {
  ballBearingDefaults,
  ballBearingModelDefinitionSchema,
  ballBearingModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  thrustBallBearingDefaults,
  thrustBallBearingModelDefinitionSchema,
  thrustBallBearingModelPropsSchema,
  type BallBearingModelPropsInput,
  type ThrustBallBearingModelPropsInput,
} from "../../src"

export function assertBallBearings() {
  expect(ballBearingDefaults).toEqual({
    innerDiameter: 8,
    outerDiameter: 22,
    width: 7,
  })
  expect(thrustBallBearingDefaults).toEqual({
    innerDiameter: 10,
    outerDiameter: 24,
    height: 9,
  })
  for (const [fn, axial, shortcut, defaults, propsSchema, definitionSchema] of [
    [
      "ballbearing",
      "width",
      "w",
      ballBearingDefaults,
      ballBearingModelPropsSchema,
      ballBearingModelDefinitionSchema,
    ],
    [
      "thrustballbearing",
      "height",
      "h",
      thrustBallBearingDefaults,
      thrustBallBearingModelPropsSchema,
      thrustBallBearingModelDefinitionSchema,
    ],
  ] as const) {
    const expected =
      fn === "ballbearing"
        ? { fn, ...ballBearingDefaults }
        : { fn, ...thrustBallBearingDefaults }
    const roadmapString =
      fn === "ballbearing"
        ? "ballbearing_id8mm_od22mm_w7mm"
        : "thrustballbearing_id10mm_od24mm_h9mm"
    expect(mp.string(roadmapString).params()).toMatchObject({
      fn,
      id: `${defaults.innerDiameter}mm`,
      od: `${defaults.outerDiameter}mm`,
    })
    expect(parseModelString(roadmapString)).toEqual(expected)
    expect(parseModelString(fn)).toEqual(expected)
    expect(propsSchema.parse({})).toEqual(defaults)
    expect(definitionSchema.parse({ fn })).toEqual(expected)
    expect(modelDefinitionSchema.parse({ fn })).toEqual(expected)
    expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
    expect(modelprinter.getModelNames()).toContain(fn)

    expect(
      parseModelString(
        ` ${fn.toUpperCase()}_INNERDIAMETER0.5in_OUTERDIAMETER2in_${axial.toUpperCase()}0.25in `,
      ),
    ).toEqual(
      fn === "ballbearing"
        ? { fn, innerDiameter: 12.7, outerDiameter: 50.8, width: 6.35 }
        : { fn, innerDiameter: 12.7, outerDiameter: 50.8, height: 6.35 },
    )
    expect(parseModelString(`${fn}_${shortcut}0.9cm_od3cm_id0.01m`)).toEqual(
      fn === "ballbearing"
        ? { fn, innerDiameter: 10, outerDiameter: 30, width: 9 }
        : { fn, innerDiameter: 10, outerDiameter: 30, height: 9 },
    )
    expect(parseModelString(`${fn}_id5`)).toEqual({
      ...expected,
      innerDiameter: 5,
    })
    expect(
      propsSchema.parse({
        innerDiameter: "0.5in",
        outerDiameter: "2in",
        [axial]: "0.25in",
      }),
    ).toEqual(
      fn === "ballbearing"
        ? { innerDiameter: 12.7, outerDiameter: 50.8, width: 6.35 }
        : { innerDiameter: 12.7, outerDiameter: 50.8, height: 6.35 },
    )

    for (const suffix of [
      "_id",
      "_od",
      `_${shortcut}`,
      "_id0",
      "_od-1",
      `_${shortcut}0`,
      "_id30",
      "_od5",
      "_id10mm_od1cm",
      "_id2cm_od10mm",
      "_id8_id9",
      "_id8_innerdiameter8",
      "_od25_outerdiameter25",
      `_${shortcut}9_${axial}9`,
      "_ID8_id8",
      "_unknown3",
      "_constructor3",
      `_${fn}`,
      "_id(8)",
      "_id1e999",
      "_id1wat",
      "_idtrue",
      "__id8",
      "_",
      fn === "ballbearing" ? "_h9" : "_w9",
    ]) {
      expect(() => parseModelString(`${fn}${suffix}`)).toThrow()
    }
    expect(() => parseModelString(`${fn}8_id8_od22`)).toThrow()
    expect(() => parseModelString(`${fn}(8)_id8_od22`)).toThrow()
    for (const property of ["innerDiameter", "outerDiameter", axial]) {
      for (const value of [
        0,
        -1,
        NaN,
        Infinity,
        -Infinity,
        "0mm",
        "-1mm",
        "nonsense",
        "1e999mm",
        true,
        null,
      ]) {
        expect(() =>
          propsSchema.parse({ ...defaults, [property]: value }),
        ).toThrow()
        expect(() =>
          modelDefinitionSchema.parse({ fn, ...defaults, [property]: value }),
        ).toThrow()
      }
    }
    for (const invalid of [
      { innerDiameter: "2cm", outerDiameter: "20mm" },
      { innerDiameter: "1in", outerDiameter: "2cm" },
      { unexpected: true },
      { [fn === "ballbearing" ? "height" : "width"]: 9 },
    ]) {
      expect(() => propsSchema.parse(invalid)).toThrow()
      expect(() => definitionSchema.parse({ fn, ...invalid })).toThrow()
      expect(() => modelDefinitionSchema.parse({ fn, ...invalid })).toThrow()
    }
  }

  const radial: BallBearingModelPropsInput = { width: "7mm" }
  const thrust: ThrustBallBearingModelPropsInput = { height: "9mm" }
  expect(ballBearingModelPropsSchema.parse(radial)).toEqual(ballBearingDefaults)
  expect(thrustBallBearingModelPropsSchema.parse(thrust)).toEqual(
    thrustBallBearingDefaults,
  )
}
