import { expect, test } from "bun:test"
import {
  getRoundedBoxDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  roundedBoxModelDefinitionSchema,
  roundedBoxModelPropsSchema,
} from "../src"

const source =
  "roundedbox_w90mm_d60mm_h30mm_wall2mm_corner8mm_screwon_lidt2mm_screws4_hole3mm_hp(70mm,40mm)_boss6mm"

test("roundedbox public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "roundedbox") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "roundedbox",
    width: 90,
    depth: 60,
    height: 30,
    wallThickness: 2,
    cornerRadius: 8,
    screwOnLid: true,
    lidThickness: 2,
    screwCount: 4,
    holeDiameter: 3,
    holePitchX: 70,
    holePitchY: 40,
    bossDiameter: 6,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(roundedBoxModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("roundedbox")
  expect(mp.string(source).params()).toMatchObject({
    fn: "roundedbox",
    w: "90mm",
    d: "60mm",
    h: "30mm",
    string: source,
  })
  expect(
    getRoundedBoxDimensions({
      width: 90,
      depth: 60,
      height: 30,
      wallThickness: 2,
      cornerRadius: 8,
      lidThickness: 2,
      holeDiameter: 3,
      holePitchX: 70,
      holePitchY: 40,
      bossDiameter: 6,
    }),
  ).toEqual({
    width: 90,
    depth: 60,
    height: 30,
    wallThickness: 2,
    cornerRadius: 8,
    screwOnLid: true,
    lidThickness: 2,
    screwCount: 4,
    holeDiameter: 3,
    holePitchX: 70,
    holePitchY: 40,
    bossDiameter: 6,
    innerWidth: 86,
    innerDepth: 56,
    innerHeight: 28,
    innerCornerRadius: 6,
    totalHeight: 32,
    bossCenters: [
      [-35, -20],
      [35, -20],
      [35, 20],
      [-35, 20],
    ],
  })
})

test("roundedbox bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["roundedbox", "ROUNDEDBOX"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "roundedbox",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("roundedbox defaults, unit conversions and explicit hpx/hpy aliases", () => {
  const concise = mp
    .string(
      "roundedbox_w90mm_d60mm_h30mm_wall2mm_corner8mm_lidt2mm_hole3mm_hp(70mm,40mm)_boss6mm",
    )
    .json()
  expect(concise).toEqual(mp.string(source).json())
  expect(
    mp
      .string(
        "ROUNDEDBOX_width9CM_depth6CM_height3CM_wallthickness0.2CM_cornerradius0.8CM_SCREWONLID_lidthickness0.2CM_screwcount4_holediameter0.3CM_hpx7CM_hpy4CM_bossdiameter0.6CM",
      )
      .json(),
  ).toEqual(mp.string(source).json())
  expect(
    roundedBoxModelPropsSchema.parse({
      width: "4in",
      depth: 60,
      height: 30,
      wallThickness: 2,
      cornerRadius: 8,
      lidThickness: 2,
      holeDiameter: 3,
      holePitchX: 70,
      holePitchY: 40,
      bossDiameter: 6,
    }).width,
  ).toBeCloseTo(101.6)
})

test("roundedbox rejects enum selectors, duplicates and malformed tokens", () => {
  const base =
    "roundedbox_w90mm_d60mm_h30mm_wall2mm_corner8mm_lidt2mm_hole3mm_hp(70mm,40mm)_boss6mm"
  for (const suffix of [
    "lid(screwon)",
    "screwon(true)",
    "screwon_screwon",
    "w90mm",
    "hpx70mm",
    "hp(70mm)",
    "corner0mm",
    "corner2mm",
    "corner30mm",
    "screws2",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "roundedbox",
    "roundedbox_w90mm",
    "roundedbox(90)_w90mm_d60mm_h30mm_wall2mm_corner8mm_lidt2mm_hole3mm_hp(70mm,40mm)_boss6mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("roundedbox direct schemas enforce corner radius and boss bounds", () => {
  const valid = {
    width: 90,
    depth: 60,
    height: 30,
    wallThickness: 2,
    cornerRadius: 8,
    lidThickness: 2,
    holeDiameter: 3,
    holePitchX: 70,
    holePitchY: 40,
    bossDiameter: 6,
  }
  for (const extra of [
    { cornerRadius: 0 },
    { cornerRadius: 2 },
    { cornerRadius: 30 },
    { wallThickness: 30 },
    { height: 2 },
    { holeDiameter: 6 },
    { holePitchX: 85 },
    { holePitchY: 54 },
    { screwCount: 6 },
    { screwOnLid: false },
    { lid: "screwon" },
    { unknown: true },
  ]) {
    const props = { ...valid, ...extra }
    expect(() => roundedBoxModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "roundedbox", ...props }),
    ).toThrow()
  }
})
