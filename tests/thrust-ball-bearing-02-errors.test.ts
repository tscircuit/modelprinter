import { expect, test } from "bun:test"
import {
  modelDefinitionSchema,
  mp,
  thrustBallBearingModelPropsSchema,
} from "../src"

test("thrust ball bearing rejects ambiguous tokens and invalid direct props", () => {
  for (const suffix of [
    "_id",
    "_od",
    "_h",
    "_w7",
    "_id0",
    "_h-1",
    "_id24",
    "_od5",
    "_id10_id10",
    "_id10_innerdiameter10",
    "_od24_outerdiameter24",
    "_h9_height9",
    "_unknown2",
    "_constructor2",
    "_id(10)",
    "_id10mmjunk",
    "_h1e2",
    "__id10",
    "_",
    "_code51100",
  ])
    expect(() => mp.string(`thrustballbearing${suffix}`).json()).toThrow()
  for (const source of ["thrustballbearing51100", "thrustballbearing(51100)"])
    expect(() => mp.string(source).json()).toThrow()
  for (const property of ["innerDiameter", "outerDiameter", "height"])
    for (const value of [
      0,
      -1,
      NaN,
      Infinity,
      -Infinity,
      "1e2",
      "10mmjunk",
      "1wat",
      null,
      true,
    ]) {
      expect(() =>
        thrustBallBearingModelPropsSchema.parse({ [property]: value }),
      ).toThrow()
      expect(() =>
        modelDefinitionSchema.parse({
          fn: "thrustballbearing",
          [property]: value,
        }),
      ).toThrow()
    }
  for (const props of [
    { innerDiameter: 24 },
    { outerDiameter: 10 },
    { innerDiameter: "1in", outerDiameter: "2cm" },
    { width: 9 },
    { unexpected: true },
  ])
    expect(() => thrustBallBearingModelPropsSchema.parse(props)).toThrow()
})
