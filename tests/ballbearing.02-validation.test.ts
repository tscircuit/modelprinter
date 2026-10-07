import { expect, test } from "bun:test"
import {
  ballBearingModelPropsSchema,
  ballBearingModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
} from "../src"

test("ball bearing rejects conflicting designations, malformed/duplicate tokens and invalid envelopes", () => {
  for (const source of [
    "ballbearing8",
    "ballbearing609",
    "ballbearing6082rsh",
    "ballbearing625zzjunk",
    "ballbearing625rs2",
    "ballbearing608_code608",
    "ballbearing608_id9",
    "ballbearing_open_bothsidesopen",
    "ballbearing_open_sealed",
    "ballbearing_topsideopen_topsidesealed",
    "ballbearing_topsideopen_topsideopen",
    "ballbearing_bottomsideopen_bottomsideshielded",
    "ballbearing_open(true)",
    "ballbearing_topsideopen1",
    "ballbearing_closure(open)",
    "ballbearing(8)",
    "ballbearing_code608junk",
    "ballbearing_code(608)",
    "ballbearing_code609",
    "ballbearing_code608_code608",
    "ballbearing_id8_innerdiameter8",
    "ballbearing_od22_outerdiameter22",
    "ballbearing_w7_width7",
    "ballbearing_closure(open)_closure(open)",
    "ballbearing_closureOPEN",
    "ballbearing_closure(open)junk",
    "ballbearing_closure(zz)",
    "ballbearing_code608_id9",
    "ballbearing_code625_od22",
    "ballbearing_code624_w7",
    "ballbearing_id22_od22",
    "ballbearing_id23_od22",
    "ballbearing_id0",
    "ballbearing_w-1",
    "ballbearing_id8mmjunk",
    "ballbearing_id(8mm)",
    "ballbearing_id1e2",
    "ballbearing_id",
    "ballbearing_constructor8",
    "ballbearing_typos8",
    "ballbearing_",
    "ballbearing__w7",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const input of [
    { innerDiameter: 0 },
    { innerDiameter: -1 },
    { outerDiameter: 8 },
    { width: 0 },
    { width: Infinity },
    { width: NaN },
    { innerDiameter: "8mmjunk" },
    { width: "1e2" },
    { code: "608", innerDiameter: 9 },
    { code: "625", width: 7 },
    { code: "609" },
    { closure: "open" },
    { bothSidesOpen: true, bothSidesSealed: true },
    { topSideOpen: true, topSideSealed: true },
    { bottomSideOpen: true, bottomSideShielded: true },
    { topSideOpen: false },
    {
      bottomSideOpen: false,
      bottomSideShielded: false,
      bottomSideSealed: false,
    },
    { topSideOpen: "true" },
    { fn: "other" },
    { extra: true },
  ]) {
    expect(() => ballBearingModelPropsSchema.parse(input)).toThrow()
    expect(() =>
      ballBearingModelDefinitionSchema.parse({ fn: "ballbearing", ...input }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "ballbearing", ...input }),
    ).toThrow()
  }
})
