import { expect, test } from "bun:test"
import {
  cableTieModelPropsSchema,
  getCableTieDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseCableTieModelParams,
} from "../src"

const example =
  "cabletie_l150mm_w3mm_t1mm_head(5mm,5mm,4mm)_toothp1mm_type(nonrelease)"
const props = {
  length: 150,
  width: 3,
  thickness: 1,
  headLength: 5,
  headWidth: 5,
  headHeight: 4,
  toothPitch: 1,
}

test("cable tie roadmap example, registry and model union", () => {
  const builder = mp.string(example)
  expect(builder.params()).toMatchObject({
    fn: "cabletie",
    head: "(5mm,5mm,4mm)",
    toothp: "1mm",
  })
  const model = builder.json()
  expect(model).toEqual({ fn: "cabletie", ...props, type: "nonrelease" })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("cabletie")
  expect(getCableTieDimensions(props)).toEqual({
    tipLength: 6,
    tipStartX: 144,
    toothCount: 144,
    toothedLength: 144,
    toothDepth: 0.25,
    toothWidth: 2.4,
    passageLength: 1.2,
    passageWidth: 3.2,
    passageCenterX: -2.5,
    minimumHeadWall: 0.5,
    pawlRootLength: 0.5,
    pawlThickness: 0.5,
    pawlWidth: 2.4,
    pawlProtrusion: 0.25,
    pawlCenterZ: 2,
  })
})

test("cable tie units, aliases and nonrelease default", () => {
  expect(
    mp
      .string(
        "CABLETIE_LENGTH15cm_WIDTH0.3cm_THICKNESS0.001m_HEADLENGTH5mm_HEADWIDTH5mm_HEADHEIGHT4mm_TOOTHPITCH1mm",
      )
      .json(),
  ).toEqual(mp.string(example).json())
  const normalized = cableTieModelPropsSchema.parse({
    length: "6in",
    width: "0.1in",
    thickness: "0.04in",
    headLength: "0.2in",
    headWidth: "0.2in",
    headHeight: "0.16in",
    toothPitch: "0.04in",
  })
  expect(normalized.length).toBeCloseTo(152.4)
  expect(normalized.type).toBe("nonrelease")
  expect(
    mp
      .string(example.replace("head(5mm,5mm,4mm)", "head(0.5cm,0.005m,4mm)"))
      .json(),
  ).toEqual(mp.string(example).json())
})

test("cable tie rejects malformed, duplicate and incompatible tokens", () => {
  for (const source of [
    "cabletie",
    `${example}_l200mm`,
    `${example}_length200mm`,
    `${example}_headlength6mm`,
    `${example}_head(6mm,6mm,4mm)`,
    `${example}_mystery2mm`,
    example.replace("l150mm", "l6mm"),
    example.replace("l150mm", "l6.5mm"),
    example.replace("head(5mm,5mm,4mm)", "head(2mm,5mm,4mm)"),
    example.replace("head(5mm,5mm,4mm)", "head(5mm,4mm,4mm)"),
    example.replace("head(5mm,5mm,4mm)", "head(5mm,5mm,1mm)"),
    example.replace("head(5mm,5mm,4mm)", "head(5mm,5mm)"),
    example.replace("head(5mm,5mm,4mm)", "head(5mm,,4mm)"),
    example.replace("toothp1mm", "toothp0mm"),
    example.replace("toothp1mm", "toothp-1mm"),
    example.replace("toothp1mm", "toothp1.2.3mm"),
    example.replace("toothp1mm", "toothp"),
    example.replace("type(nonrelease)", "type(release)"),
    example.replace("type(nonrelease)", "typenonrelease"),
    example.replace("cabletie_", "cabletie2_"),
    `${example}_`,
    example.replace("(nonrelease)", "((nonrelease))"),
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    parseCableTieModelParams({ fn: "wrong", string: example }),
  ).toThrow()
})

test("cable tie direct schema protects ratchet and tooth geometry", () => {
  for (const changes of [
    { length: 6 },
    { length: 6.5 },
    { headLength: 2 },
    { headWidth: 4 },
    { headHeight: 1 },
    { toothPitch: 0 },
    { toothPitch: "1.2.3mm" },
    { toothPitch: Number.MIN_VALUE },
    { length: Infinity },
    { thickness: NaN },
    { thickness: Number.MIN_VALUE },
    { width: Number.MAX_VALUE },
    { type: "release" },
    { extra: true },
  ])
    expect(() =>
      cableTieModelPropsSchema.parse({ ...props, ...changes }),
    ).toThrow()
  const smallest = cableTieModelPropsSchema.parse({
    ...props,
    length: 7,
    headLength: 2.2,
    headWidth: 4.2,
    headHeight: 2,
  })
  expect(getCableTieDimensions(smallest).toothCount).toBe(1)
})
