import { expect, test } from "bun:test"
import {
  linearBallBearingModelPropsSchema,
  linearBallBearingModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
} from "../src"

test("linear bearing rejects vendor designations, malformed strings and impossible tracks", () => {
  for (const source of [
    "linearballbearing8",
    "linearballbearing_bore8_id8",
    "linearballbearing_od15_outerdiameter15",
    "linearballbearing_l24_length24",
    "linearballbearing_seals(both)_seals(both)",
    "linearballbearing_bore7",
    "linearballbearing_bore7_od15",
    "linearballbearing_lm8uu",
    "linearballbearing_seals(none)",
    "linearballbearing_sealsboth",
    "linearballbearing_seals(both)junk",
    "linearballbearing_bore0",
    "linearballbearing_od8",
    "linearballbearing_l2",
    "linearballbearing_bore8mmjunk",
    "linearballbearing_bore(8mm)",
    "linearballbearing_l1e2",
    "linearballbearing_constructor8",
    "linearballbearing_",
    "linearballbearing__l24",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const props of [
    { boreDiameter: 0 },
    { boreDiameter: 7 },
    { outerDiameter: 8 },
    { length: 2 },
    { length: -1 },
    { length: Infinity },
    { length: NaN },
    { length: "24mmjunk" },
    { length: "1e2" },
    { seals: "none" },
    { extra: true },
  ]) {
    expect(() => linearBallBearingModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      linearBallBearingModelDefinitionSchema.parse({
        fn: "linearballbearing",
        ...props,
      }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "linearballbearing", ...props }),
    ).toThrow()
  }
})
