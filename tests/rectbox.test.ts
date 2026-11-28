import { expect, test } from "bun:test"
import {
  getRectBoxDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseModelString,
  rectBoxModelDefinitionSchema,
  rectBoxModelPropsSchema,
} from "../src"

const source =
  "rectbox_w100mm_d70mm_h35mm_wall2mm_corner0mm_screwon_lidt2mm_screws4_hole3mm_hp(88mm,58mm)_boss6mm"

test("rectbox public contract, dimensions and registry integration", () => {
  const model = mp.string(source).json()
  if (model.fn !== "rectbox") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "rectbox",
    width: 100,
    depth: 70,
    height: 35,
    wallThickness: 2,
    cornerRadius: 0,
    screwOnLid: true,
    lidThickness: 2,
    screwCount: 4,
    holeDiameter: 3,
    holePitchX: 88,
    holePitchY: 58,
    bossDiameter: 6,
  })
  expect(parseModelString(source)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(rectBoxModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("rectbox")
  expect(mp.string(source).params()).toMatchObject({
    fn: "rectbox",
    w: "100mm",
    d: "70mm",
    h: "35mm",
    string: source,
  })
  expect(
    getRectBoxDimensions({
      width: 100,
      depth: 70,
      height: 35,
      wallThickness: 2,
      lidThickness: 2,
      holeDiameter: 3,
      holePitchX: 88,
      holePitchY: 58,
      bossDiameter: 6,
    }),
  ).toEqual({
    width: 100,
    depth: 70,
    height: 35,
    wallThickness: 2,
    cornerRadius: 0,
    screwOnLid: true,
    lidThickness: 2,
    screwCount: 4,
    holeDiameter: 3,
    holePitchX: 88,
    holePitchY: 58,
    bossDiameter: 6,
    innerWidth: 96,
    innerDepth: 66,
    innerHeight: 33,
    totalHeight: 37,
    bossCenters: [
      [-44, -29],
      [44, -29],
      [44, 29],
      [-44, 29],
    ],
  })
})

test("rectbox bare names support renderer dispatch without a complete model", () => {
  for (const bare of ["rectbox", "RECTBOX"]) {
    const builder = mp.string(bare)
    expect(builder.params()).toMatchObject({
      fn: "rectbox",
      string: bare,
    })
    expect(() => builder.json()).toThrow()
  }
})

test("rectbox defaults, unit conversions and explicit hpx/hpy aliases", () => {
  const concise = mp
    .string(
      "rectbox_w100mm_d70mm_h35mm_wall2mm_lidt2mm_hole3mm_hp(88mm,58mm)_boss6mm",
    )
    .json()
  expect(concise).toEqual(mp.string(source).json())
  expect(
    mp
      .string(
        "RECTBOX_width10CM_depth7CM_height3.5CM_wallthickness0.2CM_cornerradius0mm_SCREWONLID_lidthickness0.2CM_screwcount4_holediameter0.3CM_hpx8.8CM_hpy5.8CM_bossdiameter0.6CM",
      )
      .json(),
  ).toEqual(mp.string(source).json())
  expect(
    rectBoxModelPropsSchema.parse({
      width: "4in",
      depth: 70,
      height: 35,
      wallThickness: 2,
      lidThickness: 2,
      holeDiameter: 3,
      holePitchX: 88,
      holePitchY: 58,
      bossDiameter: 6,
    }).width,
  ).toBeCloseTo(101.6)
})

test("rectbox rejects enum selectors, duplicates and malformed tokens", () => {
  const base =
    "rectbox_w100mm_d70mm_h35mm_wall2mm_lidt2mm_hole3mm_hp(88mm,58mm)_boss6mm"
  for (const suffix of [
    "lid(screwon)",
    "screwon(true)",
    "screwon_screwon",
    "w100mm",
    "hpx88mm",
    "hp(88mm)",
    "corner1mm",
    "screws2",
    "unknown1",
    "",
  ]) {
    expect(() => mp.string(`${base}_${suffix}`).json()).toThrow()
  }
  for (const invalid of [
    "rectbox",
    "rectbox_w100mm",
    "rectbox(100)_w100mm_d70mm_h35mm_wall2mm_lidt2mm_hole3mm_hp(88mm,58mm)_boss6mm",
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
})

test("rectbox direct schemas enforce enclosure and boss bounds", () => {
  const valid = {
    width: 100,
    depth: 70,
    height: 35,
    wallThickness: 2,
    lidThickness: 2,
    holeDiameter: 3,
    holePitchX: 88,
    holePitchY: 58,
    bossDiameter: 6,
  }
  for (const extra of [
    { cornerRadius: 2 },
    { wallThickness: 35 },
    { height: 2 },
    { holeDiameter: 6 },
    { holePitchX: 95 },
    { holePitchY: 64 },
    { holePitchX: 6 },
    { screwCount: 6 },
    { screwOnLid: false },
    { lid: "screwon" },
    { unknown: true },
  ]) {
    const props = { ...valid, ...extra }
    expect(() => rectBoxModelPropsSchema.parse(props)).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({ fn: "rectbox", ...props }),
    ).toThrow()
  }
})
