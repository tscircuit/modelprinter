import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  modelprinter,
  getLeadScrewDimensions,
  leadScrewModelPropsSchema,
} from "../src"
test("TR8 de-facto designations retain ISO-profile dimensions and distinct pitch/lead", () => {
  for (const [threadSize, lead, starts, token] of [
    ["TR8x2", 2, 1, "tr8x2"],
    ["TR8x8(P2)", 8, 4, "tr8x8(p2)"],
  ] as const) {
    const model = mp.string(`leadscrew_profile(iso2901)_${token}_l100mm`).json()
    expect(model).toEqual({
      fn: "leadscrew",
      profile: "iso2901:2016",
      threadSize,
      threadPitch: 2,
      threadLead: lead,
      threadStarts: starts,
      threadHand: "right",
      length: 100,
      chamfer: 0.25,
    })
    expect(modelDefinitionSchema.parse(model)).toEqual(model)
    expect(getLeadScrewDimensions({ threadSize, length: 100 })).toEqual({
      diameter: 8,
      threadPitch: 2,
      threadLead: lead,
      threadStarts: starts,
      includedAngle: 30,
      crestClearance: 0.25,
      pitchDiameter: 7,
      externalMinorDiameter: 5.5,
      internalMinorDiameter: 6,
      internalMajorDiameter: 8.5,
      length: 100,
      endDiameter: 7.5,
      bottomZ: 0,
      topZ: 100,
    })
  }
  expect(
    leadScrewModelPropsSchema.parse({
      threadSize: "TR8x2",
      length: "10cm",
      threadLead: "0.2cm",
      threadPitch: "2mm",
    }).length,
  ).toBe(100)
  expect(
    mp
      .string(
        "LEADSCREW_TR8X8(P2)_length1IN_hand(LEFT)_pitch0.2CM_lead8MM_starts4",
      )
      .json(),
  ).toMatchObject({
    length: 25.4,
    threadHand: "left",
    threadPitch: 2,
    threadLead: 8,
    threadStarts: 4,
  })
  expect(modelprinter.getModelNames()).toContain("leadscrew")
})
