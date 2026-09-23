import type { SheetMetalModelPropsInput } from "../../src"

export const sheetMetalExamples: SheetMetalModelPropsInput[] = [
  {
    profile: "plate",
    width: 24,
    baseLength: 28,
    holes: [
      { panel: "base", shape: "round", diameter: 3.2, u: -9, v: -7 },
      { panel: "base", shape: "round", diameter: 3.2, u: 9, v: 7 },
      { panel: "base", shape: "slot", length: 12, width: 3, u: 0, v: 0 },
    ],
  },
  {
    profile: "angle",
    width: 24,
    baseLength: 20,
    flangeHeight: 16,
    thickness: 1.2,
    insideBendRadius: 2,
    holes: [
      { panel: "base", shape: "round", diameter: 3.2, u: 0, v: -7 },
      { panel: "base", shape: "round", diameter: 3.2, u: 0, v: 7 },
      { panel: "right", shape: "slot", length: 12, width: 3, u: 0, v: 0 },
    ],
  },
  {
    profile: "channel",
    width: 28,
    baseLength: 24,
    flangeHeight: 14,
    thickness: 1,
    insideBendRadius: 2,
    holes: [
      { panel: "base", shape: "round", diameter: 3.2, u: -8, v: -9 },
      { panel: "base", shape: "round", diameter: 3.2, u: 8, v: 9 },
      { panel: "left", shape: "slot", length: 18, width: 4, u: 2, v: 0 },
      { panel: "right", shape: "slot", length: 18, width: 4, u: 2, v: 0 },
    ],
  },
]
