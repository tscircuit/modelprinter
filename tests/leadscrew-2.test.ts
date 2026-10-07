import { expect, test } from "bun:test"
import {
  mp,
  leadScrewModelPropsSchema,
  leadScrewModelDefinitionSchema,
} from "../src"
test("lead screw rejects conflicting kinematics, ambiguous syntax and nonfinite dimensions", () => {
  for (const token of [
    "pitch8mm",
    "lead2mm",
    "starts1",
    "starts4mm",
    "lead8mm_threadlead8mm",
    "hand(left)_threadhand(right)",
    "tr8x2",
    "profile(din103)",
    "profile(iso2902)",
    "l10mmjunk",
    "l1e2",
    "constructor1",
    "tr8x8",
    "tr8x4(p2)",
    "tr8x8(p1)",
    "unknown1",
    "",
  ])
    expect(() =>
      mp.string("leadscrew_tr8x8(p2)_l100mm_" + token).json(),
    ).toThrow()
  for (const source of [
    "leadscrew",
    "leadscrew8_tr8x2_l10mm",
    "leadscrew_tr8x8((p2))_l10mm",
    "leadscrew_tr8x2_l1mm_chamfer0.5mm",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const invalid of [
    { length: NaN },
    { length: Infinity },
    { length: "10mmjunk" },
    { length: " 10mm" },
    { length: 0 },
    { chamfer: 4 },
    { threadPitch: 8 },
    { threadLead: 2 },
    { threadStarts: 1 },
    { threadHand: "both" },
    { unknown: true },
  ]) {
    const props = { threadSize: "TR8x8(P2)", length: 100, ...invalid }
    expect(() => leadScrewModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      leadScrewModelDefinitionSchema.parse({ fn: "leadscrew", ...props }),
    ).toThrow()
  }
})
