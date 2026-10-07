import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  getLeadScrewNutDimensions,
  leadScrewNutModelPropsSchema,
} from "../src"
test("lead screw nuts distinguish ISO-profile mating bore from independent mounting envelope", () => {
  for (const [threadSize, lead, starts, token] of [
    ["TR8x2", 2, 1, "tr8x2"],
    ["TR8x8(P2)", 8, 4, "tr8x8(p2)"],
  ] as const) {
    const model = mp
      .string(
        `leadscrewnut_${token}_bodyod12mm_l15mm_flangeod22mm_flanget3mm_holes4_hole3.5mm_bcd16mm`,
      )
      .json()
    expect(model).toMatchObject({
      fn: "leadscrewnut",
      profile: "iso2901:2016",
      threadSize,
      threadPitch: 2,
      threadLead: lead,
      threadStarts: starts,
      threadHand: "right",
      style: "flanged",
      bodyDiameter: 12,
      length: 15,
      radialClearance: 0.05,
      boreChamfer: 1.5,
      flangeDiameter: 22,
      flangeThickness: 3,
      mountHoleCount: 4,
      mountHoleDiameter: 3.5,
      mountHoleCircleDiameter: 16,
    })
    expect(modelDefinitionSchema.parse(model)).toEqual(model)
    const d = getLeadScrewNutDimensions({ threadSize })
    expect(d.internalMinorDiameter).toBe(6)
    expect(d.internalMajorDiameter).toBe(8.5)
    expect(d.boreMinorDiameter).toBeCloseTo(6.1)
    expect(d.boreMajorDiameter).toBeCloseTo(8.6)
    expect(d.borePitchDiameter).toBeCloseTo(7.1)
    expect(d.mouthDiameter).toBeCloseTo(9.1)
    expect(d.mountHoleCenters[0]).toEqual([8, 0])
    expect(d.mountHoleCenters[1]![0]).toBeCloseTo(0)
    expect(d.mountHoleCenters[1]![1]).toBe(8)
    expect(d.bearingZ).toBe(0)
    expect(d.topZ).toBe(15)
  }
  expect(
    leadScrewNutModelPropsSchema.parse({
      threadSize: "TR8x2",
      style: "cylindrical",
    }),
  ).toMatchObject({
    flangeDiameter: 0,
    flangeThickness: 0,
    mountHoleCount: 0,
    mountHoleDiameter: 0,
    mountHoleCircleDiameter: 0,
  })
  expect(
    mp
      .string(
        "LEADSCREWNUT_TR8X8(P2)_style(CYLINDRICAL)_bodyod0.5IN_l2CM_clearance0.01CM_borechamfer0_hand(LEFT)",
      )
      .json(),
  ).toMatchObject({
    bodyDiameter: 12.7,
    length: 20,
    radialClearance: 0.1,
    boreChamfer: 0,
    threadHand: "left",
  })
  expect(modelprinter.getModelNames()).toContain("leadscrewnut")
})
