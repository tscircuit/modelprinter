import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  maleFemaleStandoffModelDefinitionSchema,
  maleFemaleStandoffModelPropsSchema,
  maleFemaleStandoffCoarsePitches,
  getMaleFemaleStandoffDimensions,
} from "../src"
const source = "malefemalestandoff_m3_af5.5mm_l10mm_studl5mm_femaledepth6mm_hex"
const input = {
  metricSize: "M3",
  acrossFlats: 5.5,
  length: 10,
  studLength: 5,
  femaleDepth: 6,
} as const

test("male-female standoff public parser, defaults, registry and schema roundtrips", () => {
  const model = mp.string(source).json()
  if (model.fn !== "malefemalestandoff") throw new Error("Unexpected model")
  expect(model).toEqual({
    fn: "malefemalestandoff",
    ...input,
    hex: true,
    threadPitch: 0.5,
    leftHand: false,
    showThreads: true,
    bodyChamfer: 0.125,
    studChamfer: 0.125,
    mouthChamfer: 0.125,
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(maleFemaleStandoffModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("malefemalestandoff")
  expect(mp.string(source).params()).toMatchObject({
    fn: "malefemalestandoff",
    m: "3",
    af: "5.5mm",
    hex: true,
    string: source,
  })
  const d = getMaleFemaleStandoffDimensions(input)
  expect(d).toMatchObject({
    diameter: 3,
    totalLength: 15,
    bearingZ: 0,
    topZ: 10,
    studTipZ: -5,
    boreFloorZ: 4,
    mouthDiameter: 3.25,
  })
  expect(d.acrossCorners).toBeCloseTo(6.350852961)
  expect(d.externalMinorDiameter).toBeCloseTo(2.386565338)
  expect(d.boreMinorDiameter).toBeCloseTo(2.458734122)
})
test("male-female standoff supports units, aliases and explicit fine left-hand threads", () => {
  expect(
    mp
      .string(
        "MALEFEMALESTANDOFF_M3_acrossflats0.55CM_length1CM_studlength0.5CM_femaledepth0.6CM_LEFTHANDED_NOTHREADS_threadpitch0.025CM",
      )
      .json(),
  ).toMatchObject({
    ...input,
    leftHand: true,
    showThreads: false,
    threadPitch: 0.25,
  })
  expect(
    maleFemaleStandoffModelPropsSchema.parse({ ...input, length: "1in" })
      .length,
  ).toBeCloseTo(25.4)
  for (const [metricSize, threadPitch] of Object.entries(
    maleFemaleStandoffCoarsePitches,
  )) {
    const props = maleFemaleStandoffModelPropsSchema.parse({
      ...input,
      metricSize,
      acrossFlats: 30,
    })
    expect(props.threadPitch).toBe(threadPitch)
    expect(maleFemaleStandoffModelPropsSchema.parse(props)).toEqual(props)
  }
  expect(
    mp.string(source.replace("_hex", "_righthanded_threads")).json(),
  ).toEqual(mp.string(source).json())
})
test("male-female standoff rejects duplicate aliases, valued flags and incomplete strings", () => {
  for (const suffix of [
    "m3",
    "af6mm",
    "acrossflats5.5mm",
    "length10mm",
    "studlength5mm",
    "femaledepth6mm",
    "hex",
    "hex1",
    "hex(true)",
    "round",
    "lefthanded_righthanded",
    "righthanded_righthanded",
    "threads_nothreads",
    "threads_threads",
    "lefthanded(true)",
    "threadhand(left)",
    "threadpitch0.5mm_threadpitch0.25mm",
    "unknown1",
    "constructor1",
    "mouthchamfer0.1mm_mouthchamfer0.1mm",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  for (const value of [
    "malefemalestandoff",
    "malefemalestandoff_m3_af5.5mm_l10mm",
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
test("male-female standoff preserves a blind socket, wall and nonzero stud tip", () => {
  for (const extra of [
    { femaleDepth: 10 },
    { femaleDepth: 11 },
    { femaleDepth: 0 },
    { length: 0 },
    { acrossFlats: 3 },
    { studLength: 0.1 },
    { threadPitch: 3 },
    { threadPitch: 0 },
    { bodyChamfer: 5 },
    { studChamfer: 2 },
    { mouthChamfer: 3 },
    { hex: false },
    { round: true },
    { unknown: true },
    { length: Infinity },
    { studLength: NaN },
    { acrossFlats: "5.5mmjunk" },
    { femaleDepth: "6e0" },
  ]) {
    expect(() =>
      maleFemaleStandoffModelPropsSchema.parse({ ...input, ...extra }),
    ).toThrow()
    expect(() =>
      modelDefinitionSchema.parse({
        fn: "malefemalestandoff",
        ...input,
        ...extra,
      }),
    ).toThrow()
  }
  expect(
    maleFemaleStandoffModelPropsSchema.parse({
      ...input,
      bodyChamfer: 0,
      studChamfer: 0,
      mouthChamfer: 0,
    }),
  ).toMatchObject({ bodyChamfer: 0, studChamfer: 0, mouthChamfer: 0 })
})
