import { expect } from "bun:test"
import {
  modelDefinitionSchema,
  mp,
  parseModelString,
  pinHeaderModelDefinitionSchema,
  pinHeaderModelPropsSchema,
} from "../../src"

export function assertPinHeader() {
  const source =
    "pinheader_p2.54mm_n6_rows2_gender(male)_w7.62mm_d5.08mm_bodyh2.54mm_above6mm_below3mm_pin0.64mm_mount(throughhole)_axis(vertical)"
  const expected = {
    fn: "pinheader",
    pitch: 2.54,
    pinCount: 6,
    rows: 2,
    gender: "male",
    width: 7.62,
    depth: 5.08,
    bodyHeight: 2.54,
    aboveLength: 6,
    belowLength: 3,
    pinWidth: 0.64,
    mount: "throughhole",
    axis: "vertical",
  } as const
  expect(mp.string(source).json()).toEqual(expected)
  expect(mp.string("pinheader").json()).toEqual(expected)
  expect(parseModelString(source)).toEqual(expected)
  expect(mp.getModelNames()).toContain("pinheader")
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(pinHeaderModelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(pinHeaderModelPropsSchema.parse({})).toEqual(props)
  const inches = mp
    .string(
      "PINHEADER_PITCH0.1in_PINCOUNT6_ROWS2_GENDER(MALE)_WIDTH0.3in_DEPTH0.2in_BODYHEIGHT0.1in_ABOVELENGTH0.6cm_BELOWLENGTH3mm_PINWIDTH0.64mm_MOUNT(THROUGHHOLE)_AXIS(VERTICAL)",
    )
    .json()
  expect(inches).toMatchObject({
    pitch: 2.54,
    depth: 5.08,
    aboveLength: 6,
    belowLength: 3,
  })
  if (inches.fn !== "pinheader") throw new Error("Wrong model family")
  expect(inches.width).toBeCloseTo(7.62, 10)
  expect(
    pinHeaderModelPropsSchema.parse({ pitch: "0.1in", bodyHeight: "0.254cm" }),
  ).toMatchObject({ pitch: 2.54, bodyHeight: 2.54 })
  expect(mp.string("pinheader_n10_rows2_w12.7mm").json()).toMatchObject({
    pinCount: 10,
    rows: 2,
    width: 12.7,
  })
  expect(mp.string("pinheader_n1_rows1_w2mm_d2mm").json()).toMatchObject({
    pinCount: 1,
    rows: 1,
    width: 2,
    depth: 2,
  })
  for (const invalid of [
    "pinheader6",
    "pinheader_n",
    "pinheader_n5",
    "pinheader_n0",
    "pinheader_n1001",
    "pinheader_rows0",
    "pinheader_rows101",
    "pinheader_n6_n6",
    "pinheader_n6_pincount6",
    "pinheader_p2.54mm_pitch2.54mm",
    "pinheader_n6.1",
    "pinheader_n6mm",
    "pinheader_n1e1",
    "pinheader_rows3",
    "pinheader_pin2.54mm",
    "pinheader_w5.5mm",
    "pinheader_d3mm",
    "pinheader_bodyh0mm",
    "pinheader_above-1mm",
    "pinheader_p1e3mm",
    "pinheader_w7.62mmgarbage",
    "pinheader_gender(female)",
    "pinheader_mount(smd)",
    "pinheader_axis(horizontal)",
    "pinheader_gender",
    "pinheader_gender(male,male)",
    "pinheader_gender(male)_gender(male)",
    "pinheader_foo1mm",
    "pinheader_fn(shaft)",
  ])
    expect(() => mp.string(invalid).json()).toThrow()
  for (const bad of [
    { pitch: Number.NaN },
    { width: Infinity },
    { pinCount: 5 },
    { pinCount: 1001 },
    { rows: 0 },
    { rows: 1.5 },
    { pinWidth: 2.54 },
    { width: 5.72 },
    { depth: 3.18 },
    { imaginary: 1 },
    { width: "10mmgarbage" },
    { height: "1e2mm" },
    { fn: "pinheader" },
    { gender: "female" },
    { belowLength: 0 },
  ])
    expect(pinHeaderModelPropsSchema.safeParse(bad).success).toBe(false)
}
