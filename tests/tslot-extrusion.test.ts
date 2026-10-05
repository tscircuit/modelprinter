import { expect, test } from "bun:test"
import {
  getTSlotExtrusionDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  tSlotExtrusionModelDefinitionSchema,
  tSlotExtrusionModelPropsSchema,
} from "../src"

const example =
  "tslotextrusion_w20mm_h20mm_l100mm_profile(fourtsolid)_slot6mm_pocket10mm_pocketd2mm_lip2mm_bore4mm_corner1mm"

test("T-slot extrusion roadmap example resolves every profile dimension", () => {
  const model = mp.string(example).json()
  if (model.fn !== "tslotextrusion") throw new Error("Wrong model family")
  expect(model).toEqual({
    fn: "tslotextrusion",
    width: 20,
    height: 20,
    length: 100,
    profile: "fourtsolid",
    slotWidth: 6,
    pocketWidth: 10,
    pocketDepth: 2,
    lipThickness: 2,
    boreDiameter: 4,
    cornerRadius: 1,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(tSlotExtrusionModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("tslotextrusion")
})

test("T-slot extrusion schemas normalize lengths and define fitting depths", () => {
  const props = tSlotExtrusionModelPropsSchema.parse({
    width: "2cm",
    height: "20mm",
    length: "1in",
    boreDiameter: "0.4cm",
  })
  expect(props.length).toBeCloseTo(25.4)
  expect(props.width).toBe(20)
  expect(props.boreDiameter).toBe(4)
  expect(getTSlotExtrusionDimensions(props)).toEqual({
    grooveDepth: 4,
    boreDepth: 25.4,
    boreAxis: "z",
    grooveFaces: ["+x", "-x", "+y", "-y"],
    minBoreWallThickness: 4,
  })
  expect(parseModelString("TSLOTEXTRUSION_L1IN")).toEqual({
    fn: "tslotextrusion",
    ...tSlotExtrusionModelPropsSchema.parse({ length: "1in" }),
  })
})

test("T-slot extrusion defaults leave square sharp corners and no bore", () => {
  const model = parseModelString("tslotextrusion")
  expect(model).toEqual({
    fn: "tslotextrusion",
    ...tSlotExtrusionModelPropsSchema.parse({}),
  })
  expect(tSlotExtrusionModelPropsSchema.parse({})).toMatchObject({
    cornerRadius: 0,
    boreDiameter: 0,
  })
})

test("T-slot extrusion rejects contradictory or unsupported profile dimensions", () => {
  for (const props of [
    { pocketWidth: 6 },
    { slotWidth: 11 },
    { pocketDepth: 3 },
    { boreDiameter: 12 },
    { cornerRadius: 5 },
    { profile: "2020" },
    { width: 0 },
    { length: Infinity },
    { length: "10mmjunk" },
    { length: "" },
    { cornerRadius: -1 },
    { boreDiameter: NaN },
    { unexpected: 1 },
  ]) {
    expect(tSlotExtrusionModelPropsSchema.safeParse(props).success).toBe(false)
    expect(
      tSlotExtrusionModelDefinitionSchema.safeParse({
        fn: "tslotextrusion",
        ...props,
      }).success,
    ).toBe(false)
  }
})

test("T-slot extrusion parser rejects repeated, incomplete and unknown tokens", () => {
  for (const value of [
    "tslotextrusion20",
    "tslotextrusion_w20mm_width20mm",
    "tslotextrusion_bore4mm_bore5mm",
    "tslotextrusion_w",
    "tslotextrusion_l10mmjunk",
    "tslotextrusion_profile2020",
    "tslotextrusion_profile(fourtsolid,fourtsolid)",
    "tslotextrusion_profile(2020)",
    "tslotextrusion_profile(fourtsolid)_profile(fourtsolid)",
    "tslotextrusion_profile((fourtsolid))",
    "tslotextrusion_unknown1mm",
    "tslotextrusion__l100mm",
  ])
    expect(() => parseModelString(value)).toThrow()
})
