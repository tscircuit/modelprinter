import { expect, test } from "bun:test"
import {
  mp,
  splitWasherModelPropsSchema,
  splitWasherModelDefinitionSchema,
  getSplitWasherDimensions,
} from "../src"

const source =
  "splitwasher_id6.1mm_od11.8mm_t1.6mm_rise1.6mm_gapangle10deg_rectangular_righthanded"
test("split washer full proposal resolves to its free-state rectangular contract", () => {
  const p = mp.string(source).json()
  if (p.fn !== "splitwasher") throw new Error("Expected split washer")
  expect(p).toEqual({
    fn: "splitwasher",
    innerDiameter: 6.1,
    outerDiameter: 11.8,
    thickness: 1.6,
    rise: 1.6,
    gapAngle: 10,
    rectangular: true,
    leftHanded: false,
  })
  expect(splitWasherModelDefinitionSchema.parse(p)).toEqual(p)
  const { fn, ...props } = p
  expect(splitWasherModelPropsSchema.parse(props)).toEqual(props)
  const d = getSplitWasherDimensions(props)
  expect(d.totalHeight).toBeCloseTo(3.2, 12)
  expect(d.radialWidth).toBeCloseTo(2.85, 12)
  expect(d.sweepAngle).toBe(350)
  expect(d.volume).toBeCloseTo(
    ((Math.PI / 4) * (11.8 ** 2 - 6.1 ** 2) * 1.6 * 350) / 360,
    12,
  )
})
test("split washer aliases, units and hand default retain physical dimensions", () => {
  const p = mp
    .string(
      "splitwasher_innerdiameter0.61cm_outerdiameter1.18cm_thickness0.16cm_rise0.16cm_gapangle10",
    )
    .json()
  if (p.fn !== "splitwasher") throw new Error("Expected split washer")
  expect(p.innerDiameter).toBeCloseTo(6.1, 12)
  expect(p.outerDiameter).toBeCloseTo(11.8, 12)
  expect(p.thickness).toBeCloseTo(1.6, 12)
  expect(p.rise).toBeCloseTo(1.6, 12)
  expect(p.gapAngle).toBe(10)
  expect(p.leftHanded).toBe(false)
  expect(
    mp.string(source.replace("righthanded", "lefthanded")).json(),
  ).toMatchObject({ leftHanded: true })
  expect(mp.string(source.replace("righthanded", "left")).json()).toMatchObject(
    { leftHanded: true },
  )
  expect(
    mp.string(source.replace("rise1.6mm", "rise0mm")).json(),
  ).toMatchObject({ rise: 0 })
})
test("split washer rejects incomplete, invalid and duplicate contracts", () => {
  for (const value of [
    "splitwasher",
    source + "_id6mm",
    source + "_innerdiameter6mm",
    source + "_left",
    source + "_rectangular",
    source + "_unknown",
    source.replace("od11.8mm", "od6mm"),
    source.replace("t1.6mm", "t0mm"),
    source.replace("rise1.6mm", "rise-1mm"),
    source.replace("gapangle10deg", "gapangle0deg"),
    source.replace("gapangle10deg", "gapangle360deg"),
    source.replace("gapangle10deg", "gapangle10mm"),
    source.replace("id6.1mm", "id6.1garbage"),
    source.replace("id6.1mm", "idInfinity"),
  ])
    expect(() => mp.string(value).json()).toThrow()
  expect(() =>
    splitWasherModelPropsSchema.parse({
      innerDiameter: 6,
      outerDiameter: 12,
      thickness: Infinity,
      rise: 1,
      gapAngle: 10,
    }),
  ).toThrow()
  expect(() =>
    splitWasherModelPropsSchema.parse({
      innerDiameter: 6,
      outerDiameter: 12,
      thickness: 1,
      rise: 1,
      gapAngle: 10,
      rectangular: false,
    }),
  ).toThrow()
})
