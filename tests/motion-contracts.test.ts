import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pillowBlockBearingModelPropsSchema,
  flangeBearingModelPropsSchema,
  needleBearingModelPropsSchema,
  cylindricalRollerBearingModelPropsSchema,
  camFollowerModelPropsSchema,
  vGrooveWheelModelPropsSchema,
  rodEndModelPropsSchema,
  sphericalBearingModelPropsSchema,
  clevisModelPropsSchema,
  gearRackModelPropsSchema,
  sprocketModelPropsSchema,
  rollerChainModelPropsSchema,
  vBeltSheaveModelPropsSchema,
  conveyorRollerModelPropsSchema,
  shaftSupportModelPropsSchema,
  getPillowBlockBearingDimensions,
  getFlangeBearingDimensions,
  getNeedleBearingDimensions,
  getCylindricalRollerBearingDimensions,
  getCamFollowerDimensions,
  getVGrooveWheelDimensions,
  getRodEndDimensions,
  getSphericalBearingDimensions,
  getClevisDimensions,
  getGearRackDimensions,
  getSprocketDimensions,
  getRollerChainDimensions,
  getVBeltSheaveDimensions,
  getConveyorRollerDimensions,
  getShaftSupportDimensions,
} from "../src"

test("pillowblockbearing: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm"
  const expected = {
    fn: "pillowblockbearing",
    boreDiameter: 20,
    baseWidth: 80,
    baseDepth: 30,
    baseThickness: 8,
    housingDiameter: 46,
    centerHeight: 30,
    mountSpacing: 60,
    mountHoleDiameter: 6,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("pillowblockbearing").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(pillowBlockBearingModelPropsSchema.parse(p)).toEqual(p)
  expect(
    pillowBlockBearingModelPropsSchema.parse({ ...p, boreDiameter: "2cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("bore20mm", "bore2cm")).json()).toEqual(
    expected,
  )
  const dimensions = getPillowBlockBearingDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getPillowBlockBearingDimensions()).toEqual(dimensions)
})
test("pillowblockbearing: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "bore1mm",
    "borediameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    boreDiameter: 20,
    baseWidth: 80,
    baseDepth: 30,
    baseThickness: 8,
    housingDiameter: 46,
    centerHeight: 30,
    mountSpacing: 60,
    mountHoleDiameter: 6,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      pillowBlockBearingModelPropsSchema.parse({ ...p, boreDiameter: value }),
    ).toThrow()
  expect(() =>
    pillowBlockBearingModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { housingDiameter: 25 },
    { centerHeight: 15 },
    { mountSpacing: 80 },
    { mountSpacing: 30 },
    { baseDepth: 5 },
  ])
    expect(() =>
      pillowBlockBearingModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})

test("flangebearing: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm"
  const expected = {
    fn: "flangebearing",
    boreDiameter: 20,
    flangeWidth: 64,
    flangeThickness: 6,
    housingDiameter: 44,
    housingHeight: 20,
    mountSpacing: 46,
    mountHoleDiameter: 6,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("flangebearing").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(flangeBearingModelPropsSchema.parse(p)).toEqual(p)
  expect(
    flangeBearingModelPropsSchema.parse({ ...p, boreDiameter: "2cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("bore20mm", "bore2cm")).json()).toEqual(
    expected,
  )
  const dimensions = getFlangeBearingDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getFlangeBearingDimensions()).toEqual(dimensions)
})
test("flangebearing: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "bore1mm",
    "borediameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    boreDiameter: 20,
    flangeWidth: 64,
    flangeThickness: 6,
    housingDiameter: 44,
    housingHeight: 20,
    mountSpacing: 46,
    mountHoleDiameter: 6,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      flangeBearingModelPropsSchema.parse({ ...p, boreDiameter: value }),
    ).toThrow()
  expect(() =>
    flangeBearingModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { housingDiameter: 25 },
    { mountSpacing: 60 },
    { mountSpacing: 20 },
    { housingHeight: 3 },
  ])
    expect(() =>
      flangeBearingModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})

test("needlebearing: defaults, model strings, units, schema and dimensions", () => {
  const source = "needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18"
  const expected = {
    fn: "needlebearing",
    innerDiameter: 20,
    outerDiameter: 30,
    width: 20,
    raceThickness: 1.5,
    rollerCount: 18,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("needlebearing").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(needleBearingModelPropsSchema.parse(p)).toEqual(p)
  expect(
    needleBearingModelPropsSchema.parse({ ...p, innerDiameter: "2cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("id20mm", "id2cm")).json()).toEqual(expected)
  const dimensions = getNeedleBearingDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getNeedleBearingDimensions()).toEqual(dimensions)
})
test("needlebearing: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "id1mm",
    "innerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    innerDiameter: 20,
    outerDiameter: 30,
    width: 20,
    raceThickness: 1.5,
    rollerCount: 18,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      needleBearingModelPropsSchema.parse({ ...p, innerDiameter: value }),
    ).toThrow()
  expect(() =>
    needleBearingModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { outerDiameter: 25 },
    { width: 2 },
    { rollerCount: 64 },
  ])
    expect(() =>
      needleBearingModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      needleBearingModelPropsSchema.parse({ ...p, rollerCount: value }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("rollers18", "rollers18mm")).json(),
  ).toThrow()
})

test("cylindricalrollerbearing: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12"
  const expected = {
    fn: "cylindricalrollerbearing",
    innerDiameter: 20,
    outerDiameter: 42,
    width: 16,
    raceThickness: 3,
    rollerCount: 12,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("cylindricalrollerbearing").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(cylindricalRollerBearingModelPropsSchema.parse(p)).toEqual(p)
  expect(
    cylindricalRollerBearingModelPropsSchema.parse({
      ...p,
      innerDiameter: "2cm",
    }),
  ).toEqual(p)
  expect(mp.string(source.replace("id20mm", "id2cm")).json()).toEqual(expected)
  const dimensions = getCylindricalRollerBearingDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getCylindricalRollerBearingDimensions()).toEqual(dimensions)
})
test("cylindricalrollerbearing: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "id1mm",
    "innerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    innerDiameter: 20,
    outerDiameter: 42,
    width: 16,
    raceThickness: 3,
    rollerCount: 12,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      cylindricalRollerBearingModelPropsSchema.parse({
        ...p,
        innerDiameter: value,
      }),
    ).toThrow()
  expect(() =>
    cylindricalRollerBearingModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { outerDiameter: 30 },
    { width: 5 },
    { rollerCount: 64 },
  ])
    expect(() =>
      cylindricalRollerBearingModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      cylindricalRollerBearingModelPropsSchema.parse({
        ...p,
        rollerCount: value,
      }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("rollers12", "rollers12mm")).json(),
  ).toThrow()
})

test("camfollower: defaults, model strings, units, schema and dimensions", () => {
  const source = "camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10"
  const expected = {
    fn: "camfollower",
    wheelDiameter: 32,
    wheelWidth: 14,
    studDiameter: 10,
    studLength: 26,
    socketDiameter: 5,
    rollerCount: 10,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("camfollower").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(camFollowerModelPropsSchema.parse(p)).toEqual(p)
  expect(
    camFollowerModelPropsSchema.parse({ ...p, wheelDiameter: "3.2cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od32mm", "od3.2cm")).json()).toEqual(
    expected,
  )
  const dimensions = getCamFollowerDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getCamFollowerDimensions()).toEqual(dimensions)
})
test("camfollower: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "wheeldiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    wheelDiameter: 32,
    wheelWidth: 14,
    studDiameter: 10,
    studLength: 26,
    socketDiameter: 5,
    rollerCount: 10,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      camFollowerModelPropsSchema.parse({ ...p, wheelDiameter: value }),
    ).toThrow()
  expect(() =>
    camFollowerModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { wheelDiameter: 20 },
    { wheelWidth: 4 },
    { socketDiameter: 12 },
    { studLength: 8 },
  ])
    expect(() =>
      camFollowerModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      camFollowerModelPropsSchema.parse({ ...p, rollerCount: value }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("rollers10", "rollers10mm")).json(),
  ).toThrow()
})

test("vgroovewheel: defaults, model strings, units, schema and dimensions", () => {
  const source = "vgroovewheel_od40mm_root28mm_bore8mm_w12mm"
  const expected = {
    fn: "vgroovewheel",
    outerDiameter: 40,
    rootDiameter: 28,
    boreDiameter: 8,
    width: 12,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("vgroovewheel").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(vGrooveWheelModelPropsSchema.parse(p)).toEqual(p)
  expect(
    vGrooveWheelModelPropsSchema.parse({ ...p, outerDiameter: "4cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od40mm", "od4cm")).json()).toEqual(expected)
  const dimensions = getVGrooveWheelDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getVGrooveWheelDimensions()).toEqual(dimensions)
})
test("vgroovewheel: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "vgroovewheel_od40mm_root28mm_bore8mm_w12mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = { outerDiameter: 40, rootDiameter: 28, boreDiameter: 8, width: 12 }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      vGrooveWheelModelPropsSchema.parse({ ...p, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    vGrooveWheelModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [{ rootDiameter: 8 }, { outerDiameter: 28 }])
    expect(() =>
      vGrooveWheelModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})

test("rodend: defaults, model strings, units, schema and dimensions", () => {
  const source = "rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm"
  const expected = {
    fn: "rodend",
    headDiameter: 28,
    boreDiameter: 12,
    headWidth: 12,
    stemDiameter: 10,
    stemLength: 30,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("rodend").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(rodEndModelPropsSchema.parse(p)).toEqual(p)
  expect(rodEndModelPropsSchema.parse({ ...p, headDiameter: "2.8cm" })).toEqual(
    p,
  )
  expect(mp.string(source.replace("hd28mm", "hd2.8cm")).json()).toEqual(
    expected,
  )
  const dimensions = getRodEndDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getRodEndDimensions()).toEqual(dimensions)
})
test("rodend: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "hd1mm",
    "headdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    headDiameter: 28,
    boreDiameter: 12,
    headWidth: 12,
    stemDiameter: 10,
    stemLength: 30,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      rodEndModelPropsSchema.parse({ ...p, headDiameter: value }),
    ).toThrow()
  expect(() => rodEndModelPropsSchema.parse({ ...p, unknown: true })).toThrow()
  for (const patch of [
    { headDiameter: 18 },
    { headWidth: 19 },
    { headWidth: 3 },
    { stemDiameter: 13 },
  ])
    expect(() => rodEndModelPropsSchema.parse({ ...p, ...patch })).toThrow()
})

test("sphericalbearing: defaults, model strings, units, schema and dimensions", () => {
  const source = "sphericalbearing_od30mm_bore12mm_w14mm_ball22mm"
  const expected = {
    fn: "sphericalbearing",
    outerDiameter: 30,
    boreDiameter: 12,
    width: 14,
    ballDiameter: 22,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("sphericalbearing").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(sphericalBearingModelPropsSchema.parse(p)).toEqual(p)
  expect(
    sphericalBearingModelPropsSchema.parse({ ...p, outerDiameter: "3cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od30mm", "od3cm")).json()).toEqual(expected)
  const dimensions = getSphericalBearingDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getSphericalBearingDimensions()).toEqual(dimensions)
})
test("sphericalbearing: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "sphericalbearing_od30mm_bore12mm_w14mm_ball22mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = { outerDiameter: 30, boreDiameter: 12, width: 14, ballDiameter: 22 }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      sphericalBearingModelPropsSchema.parse({ ...p, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    sphericalBearingModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { outerDiameter: 20 },
    { ballDiameter: 10 },
    { width: 22 },
    { width: 2 },
    { width: 20 },
  ])
    expect(() =>
      sphericalBearingModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})

test("clevis: defaults, model strings, units, schema and dimensions", () => {
  const source = "clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm"
  const expected = {
    fn: "clevis",
    width: 30,
    length: 45,
    height: 20,
    gap: 14,
    backThickness: 10,
    pinDiameter: 8,
    mountDiameter: 10,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("clevis").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(clevisModelPropsSchema.parse(p)).toEqual(p)
  expect(clevisModelPropsSchema.parse({ ...p, width: "3cm" })).toEqual(p)
  expect(mp.string(source.replace("w30mm", "w3cm")).json()).toEqual(expected)
  const dimensions = getClevisDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getClevisDimensions()).toEqual(dimensions)
})
test("clevis: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm"
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    width: 30,
    length: 45,
    height: 20,
    gap: 14,
    backThickness: 10,
    pinDiameter: 8,
    mountDiameter: 10,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() => clevisModelPropsSchema.parse({ ...p, width: value })).toThrow()
  expect(() => clevisModelPropsSchema.parse({ ...p, unknown: true })).toThrow()
  for (const patch of [
    { gap: 30 },
    { pinDiameter: 20 },
    { mountDiameter: 21 },
    { length: 25 },
  ])
    expect(() => clevisModelPropsSchema.parse({ ...p, ...patch })).toThrow()
})

test("gearrack: defaults, model strings, units, schema and dimensions", () => {
  const source = "gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm"
  const expected = {
    fn: "gearrack",
    pitch: 8,
    toothCount: 12,
    width: 12,
    baseHeight: 8,
    toothHeight: 4,
    mountHoleDiameter: 3.5,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("gearrack").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(gearRackModelPropsSchema.parse(p)).toEqual(p)
  expect(gearRackModelPropsSchema.parse({ ...p, pitch: "0.8cm" })).toEqual(p)
  expect(mp.string(source.replace("pitch8mm", "pitch0.8cm")).json()).toEqual(
    expected,
  )
  const dimensions = getGearRackDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getGearRackDimensions()).toEqual(dimensions)
})
test("gearrack: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm"
  for (const suffix of ["", "typo1mm", "constructor1", "pitch1mm", "pitch1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    pitch: 8,
    toothCount: 12,
    width: 12,
    baseHeight: 8,
    toothHeight: 4,
    mountHoleDiameter: 3.5,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      gearRackModelPropsSchema.parse({ ...p, pitch: value }),
    ).toThrow()
  expect(() =>
    gearRackModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { mountHoleDiameter: 10 },
    { toothHeight: 9 },
    { toothCount: 2 },
  ])
    expect(() => gearRackModelPropsSchema.parse({ ...p, ...patch })).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      gearRackModelPropsSchema.parse({ ...p, toothCount: value }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("teeth12", "teeth12mm")).json(),
  ).toThrow()
})

test("sprocket: defaults, model strings, units, schema and dimensions", () => {
  const source = "sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm"
  const expected = {
    fn: "sprocket",
    outerDiameter: 60,
    rootDiameter: 48,
    width: 8,
    boreDiameter: 12,
    toothCount: 16,
    hubDiameter: 26,
    hubHeight: 10,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("sprocket").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(sprocketModelPropsSchema.parse(p)).toEqual(p)
  expect(
    sprocketModelPropsSchema.parse({ ...p, outerDiameter: "6cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od60mm", "od6cm")).json()).toEqual(expected)
  const dimensions = getSprocketDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getSprocketDimensions()).toEqual(dimensions)
})
test("sprocket: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    outerDiameter: 60,
    rootDiameter: 48,
    width: 8,
    boreDiameter: 12,
    toothCount: 16,
    hubDiameter: 26,
    hubHeight: 10,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      sprocketModelPropsSchema.parse({ ...p, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    sprocketModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { outerDiameter: 40 },
    { rootDiameter: 24 },
    { hubDiameter: 10 },
    { rootDiameter: 30 },
    { toothCount: 64 },
  ])
    expect(() => sprocketModelPropsSchema.parse({ ...p, ...patch })).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      sprocketModelPropsSchema.parse({ ...p, toothCount: value }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("teeth16", "teeth16mm")).json(),
  ).toThrow()
})

test("rollerchain: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm"
  const expected = {
    fn: "rollerchain",
    pitch: 12.7,
    linkCount: 6,
    rollerDiameter: 7.9,
    width: 8,
    pinDiameter: 4,
    plateThickness: 1.2,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("rollerchain").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(rollerChainModelPropsSchema.parse(p)).toEqual(p)
  expect(rollerChainModelPropsSchema.parse({ ...p, pitch: "1.27cm" })).toEqual(
    p,
  )
  expect(
    mp.string(source.replace("pitch12.7mm", "pitch1.27cm")).json(),
  ).toEqual(expected)
  const dimensions = getRollerChainDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getRollerChainDimensions()).toEqual(dimensions)
})
test("rollerchain: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm"
  for (const suffix of ["", "typo1mm", "constructor1", "pitch1mm", "pitch1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    pitch: 12.7,
    linkCount: 6,
    rollerDiameter: 7.9,
    width: 8,
    pinDiameter: 4,
    plateThickness: 1.2,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      rollerChainModelPropsSchema.parse({ ...p, pitch: value }),
    ).toThrow()
  expect(() =>
    rollerChainModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { pitch: 8 },
    { rollerDiameter: 3 },
    { width: 5 },
    { pinDiameter: 1 },
  ])
    expect(() =>
      rollerChainModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      rollerChainModelPropsSchema.parse({ ...p, linkCount: value }),
    ).toThrow()
  expect(() => mp.string(source.replace("links6", "links6mm")).json()).toThrow()
})

test("vbeltsheave: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm"
  const expected = {
    fn: "vbeltsheave",
    outerDiameter: 60,
    boreDiameter: 12,
    width: 24,
    grooveCount: 2,
    grooveDepth: 8,
    grooveWidth: 9,
    hubDiameter: 26,
    hubHeight: 8,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("vbeltsheave").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(vBeltSheaveModelPropsSchema.parse(p)).toEqual(p)
  expect(
    vBeltSheaveModelPropsSchema.parse({ ...p, outerDiameter: "6cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od60mm", "od6cm")).json()).toEqual(expected)
  const dimensions = getVBeltSheaveDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getVBeltSheaveDimensions()).toEqual(dimensions)
})
test("vbeltsheave: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    outerDiameter: 60,
    boreDiameter: 12,
    width: 24,
    grooveCount: 2,
    grooveDepth: 8,
    grooveWidth: 9,
    hubDiameter: 26,
    hubHeight: 8,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      vBeltSheaveModelPropsSchema.parse({ ...p, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    vBeltSheaveModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { grooveWidth: 12 },
    { grooveDepth: 20 },
    { hubDiameter: 10 },
  ])
    expect(() =>
      vBeltSheaveModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
  for (const value of [1, 65, 2.5, Infinity, "3mm"])
    expect(() =>
      vBeltSheaveModelPropsSchema.parse({ ...p, grooveCount: value }),
    ).toThrow()
  expect(() =>
    mp.string(source.replace("grooves2", "grooves2mm")).json(),
  ).toThrow()
})

test("conveyorroller: defaults, model strings, units, schema and dimensions", () => {
  const source = "conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm"
  const expected = {
    fn: "conveyorroller",
    outerDiameter: 50,
    length: 150,
    wallThickness: 3,
    shaftDiameter: 10,
    shaftExtension: 15,
    endThickness: 4,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("conveyorroller").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(conveyorRollerModelPropsSchema.parse(p)).toEqual(p)
  expect(
    conveyorRollerModelPropsSchema.parse({ ...p, outerDiameter: "5cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("od50mm", "od5cm")).json()).toEqual(expected)
  const dimensions = getConveyorRollerDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getConveyorRollerDimensions()).toEqual(dimensions)
})
test("conveyorroller: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source = "conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    outerDiameter: 50,
    length: 150,
    wallThickness: 3,
    shaftDiameter: 10,
    shaftExtension: 15,
    endThickness: 4,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      conveyorRollerModelPropsSchema.parse({ ...p, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    conveyorRollerModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { outerDiameter: 15 },
    { length: 6 },
    { wallThickness: 21 },
  ])
    expect(() =>
      conveyorRollerModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})

test("shaftsupport: defaults, model strings, units, schema and dimensions", () => {
  const source =
    "shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm"
  const expected = {
    fn: "shaftsupport",
    boreDiameter: 16,
    baseWidth: 55,
    baseDepth: 32,
    baseThickness: 7,
    headWidth: 26,
    headDepth: 20,
    headHeight: 34,
    centerHeight: 26,
    mountSpacing: 40,
    mountHoleDiameter: 5,
    slitWidth: 1.5,
    clampHoleDiameter: 4,
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("shaftsupport").json()).toEqual(expected)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...p } = expected
  expect(shaftSupportModelPropsSchema.parse(p)).toEqual(p)
  expect(
    shaftSupportModelPropsSchema.parse({ ...p, boreDiameter: "1.6cm" }),
  ).toEqual(p)
  expect(mp.string(source.replace("bore16mm", "bore1.6cm")).json()).toEqual(
    expected,
  )
  const dimensions = getShaftSupportDimensions(p)
  expect(dimensions.size.every((v) => Number.isFinite(v) && v > 0)).toBe(true)
  expect(getShaftSupportDimensions()).toEqual(dimensions)
})
test("shaftsupport: strict tokens, duplicates, finite lengths and incompatible relations", () => {
  const source =
    "shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm"
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "bore1mm",
    "borediameter1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  const p = {
    boreDiameter: 16,
    baseWidth: 55,
    baseDepth: 32,
    baseThickness: 7,
    headWidth: 26,
    headDepth: 20,
    headHeight: 34,
    centerHeight: 26,
    mountSpacing: 40,
    mountHoleDiameter: 5,
    slitWidth: 1.5,
    clampHoleDiameter: 4,
  }
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      shaftSupportModelPropsSchema.parse({ ...p, boreDiameter: value }),
    ).toThrow()
  expect(() =>
    shaftSupportModelPropsSchema.parse({ ...p, unknown: true }),
  ).toThrow()
  for (const patch of [
    { headWidth: 16 },
    { centerHeight: 15 },
    { headHeight: 25 },
    { mountSpacing: 51 },
    { mountSpacing: 20 },
    { slitWidth: 16 },
    { headDepth: 32 },
    { mountHoleDiameter: 33 },
    { clampHoleDiameter: 21 },
  ])
    expect(() =>
      shaftSupportModelPropsSchema.parse({ ...p, ...patch }),
    ).toThrow()
})
