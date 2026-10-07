import { expect, test } from "bun:test"
import {
  mp,
  leadScrewNutModelPropsSchema,
  leadScrewNutModelDefinitionSchema,
} from "../src"
test("nut validates independent mounting ligaments and coherent thread assertions strictly", () => {
  for (const invalid of [
    { threadPitch: 8 },
    { threadLead: 2 },
    { threadStarts: 1 },
    { bodyDiameter: 8.6 },
    { bodyDiameter: 9.1 },
    { radialClearance: -1 },
    { length: 3 },
    { boreChamfer: 0.5 },
    { boreChamfer: 8 },
    { flangeDiameter: 12 },
    { flangeThickness: 0 },
    { flangeThickness: 15 },
    { mountHoleCount: 2 },
    { mountHoleCircleDiameter: 15 },
    { mountHoleCircleDiameter: 19 },
    { mountHoleDiameter: 0 },
    { style: "cylindrical", flangeDiameter: 22 },
    { style: "cylindrical", mountHoleCount: 4 },
    { mountHoleCount: 0, mountHoleDiameter: 3.5 },
    { bodyDiameter: "12mmjunk" },
    { length: Infinity },
    { unknown: true },
  ]) {
    const props = { threadSize: "TR8x8(P2)", ...invalid }
    expect(() => leadScrewNutModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      leadScrewNutModelDefinitionSchema.parse({ fn: "leadscrewnut", ...props }),
    ).toThrow()
  }
  for (const suffix of [
    "pitch8mm",
    "lead2mm",
    "starts1",
    "holes4mm",
    "holes2",
    "bodyod12mm_bodydiameter12mm",
    "flangeod22mm_flangediameter22mm",
    "l15mm_length15mm",
    "hole3.5mm_holediameter3.5mm",
    "hand(left)_threadhand(right)",
    "tr8x2",
    "profile(iso2903)",
    "bodyod1e2",
    "bcd16mmjunk",
    "",
  ])
    expect(() => mp.string("leadscrewnut_tr8x8(p2)_" + suffix).json()).toThrow()
  expect(
    leadScrewNutModelPropsSchema.parse({
      threadSize: "TR8x2",
      mountHoleCount: 0,
    }),
  ).toMatchObject({
    mountHoleCount: 0,
    mountHoleDiameter: 0,
    mountHoleCircleDiameter: 0,
  })
})
