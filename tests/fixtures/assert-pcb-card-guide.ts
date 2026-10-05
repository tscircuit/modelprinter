import { expect } from "bun:test"
import {
  modelDefinitionSchema,
  mp,
  parseModelString,
  pcbCardGuideModelDefinitionSchema,
  pcbCardGuideModelPropsSchema,
} from "../../src"

export function assertPcbCardGuide() {
  const source =
    "pcbcardguide_l100mm_w8mm_h10mm_slotw1.8mm_slotd6mm_mounts2_hole3mm_hp90mm"
  const expected = {
    fn: "pcbcardguide",
    spec: "customv1",
    length: 100,
    width: 8,
    height: 10,
    slotWidth: 1.8,
    slotDepth: 6,
    mountCount: 2,
    holeDiameter: 3,
    holePitch: 90,
    endWeb: 1,
    mountEdgeMargin: 1,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("pcbcardguide").json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(mp.getModelNames()).toContain("pcbcardguide")
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(pcbCardGuideModelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(pcbCardGuideModelPropsSchema.parse({})).toEqual(props)
  expect(
    mp
      .string(
        "PCBCARDGUIDE_LENGTH4in_WIDTH0.4in_HEIGHT1cm_SLOTWIDTH1.8mm_SLOTDEPTH0.6cm_MOUNTCOUNT2_HOLEDIAMETER3mm_HOLEPITCH9cm_ENDWEB1mm_MOUNTEDGEMARGIN1mm_SPEC(CUSTOMV1)",
      )
      .json(),
  ).toMatchObject({ length: 101.6, width: 10.16, height: 10, holePitch: 90 })
  expect(
    pcbCardGuideModelPropsSchema.parse({ length: "4in", height: "1cm" }),
  ).toMatchObject({ length: 101.6, height: 10 })
  for (const invalid of [
    "pcbcardguide10",
    "pcbcardguide_l",
    "pcbcardguide_l100mm_l120mm",
    "pcbcardguide_l100mm_length120mm",
    "pcbcardguide_mounts2_mountcount2",
    "pcbcardguide_mounts3",
    "pcbcardguide_mounts2.1",
    "pcbcardguide_mounts2mm",
    "pcbcardguide_slotw8mm",
    "pcbcardguide_slotd10mm",
    "pcbcardguide_hp100mm",
    "pcbcardguide_hp4mm",
    "pcbcardguide_hole7mm",
    "pcbcardguide_endweb0mm",
    "pcbcardguide_foo1mm",
    "pcbcardguide_spec(custom)",
    "pcbcardguide_l0mm",
    "pcbcardguide_l-1mm",
    "pcbcardguide_l1e3mm",
    "pcbcardguide_l100mmgarbage",
    "pcbcardguide__w8mm",
    "pcbcardguide_slot(1mm,2mm)",
    "pcbcardguide_fn(shaft)",
  ])
    expect(() => mp.string(invalid).json()).toThrow()
  for (const props of [
    { length: Number.NaN },
    { length: Infinity },
    { slotDepth: -1 },
    { slotWidth: 8 },
    { height: 6 },
    { endWeb: 45 },
    { mountCount: 3 },
    { holePitch: 100 },
    { holeDiameter: 7 },
    { imaginary: 1 },
    { width: "10mmgarbage" },
    { height: "1e2mm" },
    { fn: "pcbcardguide" },
    { spec: "custom" },
  ])
    expect(pcbCardGuideModelPropsSchema.safeParse(props).success).toBe(false)
  // Exact boundary preserves one-millimeter mounting margins and a solid floor.
  expect(
    pcbCardGuideModelPropsSchema.parse({
      length: 95,
      width: 5,
      slotDepth: 9.99,
    }),
  ).toMatchObject({ length: 95, width: 5, slotDepth: 9.99 })
}
