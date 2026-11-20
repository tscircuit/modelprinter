import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  maleStandoffModelDefinitionSchema,
  maleStandoffModelPropsSchema,
  maleStandoffCoarsePitches,
  getMaleStandoffDimensions,
} from "../src"

const source = "malestandoff_m3_af5.5mm_l10mm_studl5mm_hex_equalends"
const input = {
  metricSize: "M3",
  acrossFlats: 5.5,
  length: 10,
  studLength: 5,
} as const

test("male standoff public parser, defaults, registry and schema roundtrips", () => {
  const model = mp.string(source).json()
  if (model.fn !== "malestandoff") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "malestandoff",
    ...input,
    hex: true,
    equalEnds: true,
    threadPitch: 0.5,
    leftHand: false,
    showThreads: true,
    bodyChamfer: 0.125,
    studChamfer: 0.125,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(maleStandoffModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("malestandoff")
  expect(mp.string(source).params()).toMatchObject({
    fn: "malestandoff",
    m: "3",
    af: "5.5mm",
    hex: true,
    equalends: true,
    string: source,
  })
  const d = getMaleStandoffDimensions(input)
  expect(d).toMatchObject({
    diameter: 3,
    endAcrossFlats: 5.25,
    bearingZ: 0,
    topZ: 10,
    bottomStudTipZ: -5,
    topStudTipZ: 15,
    totalLength: 20,
  })
  expect(d.acrossCorners).toBeCloseTo(6.350852961)
  expect(d.externalMinorDiameter).toBeCloseTo(2.386565338)
  expect(d.studTipDiameter).toBeCloseTo(2.136565338)
  expect(d.studChamferDepth).toBeCloseTo(0.431717331)
})

test("male standoff supports units, chamfer aliases and explicit fine left-hand threads", () => {
  expect(
    mp
      .string(
        "MALESTANDOFF_M3_acrossflats0.55CM_length1CM_studlength0.5CM_chamfer0.03CM_studchamfer0.01CM_LEFTHANDED_NOTHREADS_threadpitch0.025CM",
      )
      .json(),
  ).toMatchObject({
    ...input,
    leftHand: true,
    showThreads: false,
    threadPitch: 0.25,
    bodyChamfer: 0.3,
    studChamfer: 0.1,
  })
  expect(
    maleStandoffModelPropsSchema.parse({ ...input, length: "1in" }).length,
  ).toBeCloseTo(25.4)
  for (const [metricSize, threadPitch] of Object.entries(
    maleStandoffCoarsePitches,
  )) {
    const props = maleStandoffModelPropsSchema.parse({
      ...input,
      metricSize,
      acrossFlats: 30,
    })
    expect(props.threadPitch).toBe(threadPitch)
    expect(maleStandoffModelPropsSchema.parse(props)).toEqual(props)
  }
  expect(
    mp
      .string("malestandoff_m3_af5.5mm_l10mm_studl5mm_righthanded_threads")
      .json(),
  ).toEqual(mp.string(source).json())
})

test("male standoff rejects duplicate aliases, valued flags and incomplete strings", () => {
  for (const suffix of [
    "m3",
    "af6mm",
    "acrossflats5.5mm",
    "length10mm",
    "studlength5mm",
    "hex",
    "hex1",
    "hex(true)",
    "equalends",
    "equalends1",
    "ends(equal)",
    "round",
    "lefthanded_righthanded",
    "righthanded_righthanded",
    "threads_nothreads",
    "threads_threads",
    "lefthanded(true)",
    "threadhand(left)",
    "threadpitch0.5mm_threadpitch0.25mm",
    "chamfer0.2mm_bodychamfer0.2mm",
    "studchamfer0.1mm_studchamfer0.1mm",
    "chamfer",
    "unknown1",
    "constructor1",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  for (const value of [
    "malestandoff",
    "malestandoff_m3_af5.5mm_l10mm",
    source.replace("m3", "m3mm"),
    source.replace("m3", "m7"),
    source.replace("l10mm", "l10mmjunk"),
    source.replace("l10mm", "l1e2"),
    source.replace("l10mm", "l(10mm)"),
    source.replace("standoff_", "standoff(3)_"),
    `${source}_`,
  ])
    expect(() => mp.string(value).json()).toThrow()
})

test("male standoff preserves flat bearing shoulders, finite bounds and nonzero stud tips", () => {
  for (const extra of [
    { length: 0 },
    { length: -1 },
    { acrossFlats: 3 },
    { studLength: 0.1 },
    { studLength: 0 },
    { threadPitch: 3 },
    { threadPitch: 0 },
    { bodyChamfer: 5 },
    { studChamfer: 2 },
    { hex: false },
    { equalEnds: false },
    { round: true },
    { unknown: true },
    { length: Infinity },
    { length: 1e150 },
    { studLength: NaN },
    { acrossFlats: "5.5mmjunk" },
    { studLength: "5e0" },
  ]) {
    expect(() =>
      maleStandoffModelPropsSchema.parse({ ...input, ...extra }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({
        fn: "malestandoff",
        ...input,
        ...extra,
      }),
    ).toThrow()
  }
  expect(
    maleStandoffModelPropsSchema.parse({
      ...input,
      bodyChamfer: 0,
      studChamfer: 0,
    }),
  ).toMatchObject({ bodyChamfer: 0, studChamfer: 0 })
})
