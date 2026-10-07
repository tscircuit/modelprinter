import { expect, test } from "bun:test"
import {
  linearBearingBlockModelPropsSchema,
  linearBearingBlockModelDefinitionSchema,
  modelDefinitionSchema,
  mp,
} from "../src"

test("bearing block rejects intersecting/breakout mounting holes and malformed tokens", () => {
  for (const source of [
    "linearbearingblock8",
    "linearbearingblock_scs8uu",
    "linearbearingblock_bore8_id8",
    "linearbearingblock_w34_width34",
    "linearbearingblock_hole4.5_holediameter4.5",
    "linearbearingblock_mount(clearance)_mount(clearance)",
    "linearbearingblock_mount(threaded)",
    "linearbearingblock_mountclearance",
    "linearbearingblock_mount(clearance)junk",
    "linearbearingblock_pitchx19.5",
    "linearbearingblock_pitchy19.5",
    "linearbearingblock_pitchx29.5",
    "linearbearingblock_h15",
    "linearbearingblock_bearingod8",
    "linearbearingblock_l2",
    "linearbearingblock_bore8junk",
    "linearbearingblock_l1e2",
    "linearbearingblock_constructor1",
    "linearbearingblock_",
    "linearbearingblock__w34",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const props of [
    { boreDiameter: 0 },
    { bearingOuterDiameter: 8 },
    { height: 15 },
    { width: 15 },
    { mountPitchX: 19.5 },
    { mountPitchX: 29.5 },
    { mountPitchY: 19.5 },
    { mountHoleDiameter: 16 },
    { length: 2 },
    { length: Infinity },
    { length: NaN },
    { height: "24mmjunk" },
    { mount: "threaded" },
    { extra: true },
  ]) {
    expect(() => linearBearingBlockModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      linearBearingBlockModelDefinitionSchema.parse({
        fn: "linearbearingblock",
        ...props,
      }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "linearbearingblock", ...props }),
    ).toThrow()
  }
})
