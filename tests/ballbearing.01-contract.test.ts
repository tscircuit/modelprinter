import { expect, test } from "bun:test"
import {
  ballBearingDefaults,
  ballBearingStandardSizes,
  ballBearingModelPropsSchema,
  ballBearingModelDefinitionSchema,
  getBallBearingDimensions,
  mp,
  modelDefinitionSchema,
  normalizeBallBearingModelString,
} from "../src"

const faces = (top: string, bottom = top) => ({
  topSideOpen: top === "open",
  topSideShielded: top === "shielded",
  topSideSealed: top === "sealed",
  bottomSideOpen: bottom === "open",
  bottomSideShielded: bottom === "shielded",
  bottomSideSealed: bottom === "sealed",
})

test("radial bearing shorthand expands to dimensions and idempotent face flags", () => {
  for (const [code, envelope] of Object.entries(ballBearingStandardSizes)) {
    for (const [suffix, top, bottom] of [
      ["", "open", "open"],
      ["z", "open", "shielded"],
      ["zz", "shielded", "shielded"],
      ["2z", "shielded", "shielded"],
      ["rs", "open", "sealed"],
      ["2rs", "sealed", "sealed"],
    ]) {
      const source = `ballbearing${code}${suffix}`
      const parsed = mp.string(source).json()
      if (parsed.fn !== "ballbearing")
        throw new Error("Expected radial bearing")
      expect(parsed).toEqual({
        fn: "ballbearing",
        ...envelope,
        ...faces(top!, bottom!),
      })
      expect(ballBearingModelDefinitionSchema.parse(parsed)).toEqual(parsed)
      expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
      expect(
        ballBearingModelPropsSchema.parse({ code, ...faces(top!, bottom!) }),
      ).toEqual({ ...envelope, ...faces(top!, bottom!) })
      const canonical = mp.string(source).params().string
      expect(canonical).not.toContain("code")
      expect(mp.string(canonical).json()).toEqual(parsed)
      expect(normalizeBallBearingModelString(canonical)).toBe(canonical)
      expect(mp.string(source.toUpperCase()).json()).toEqual(parsed)
    }
    const d = getBallBearingDimensions({
      code: code as keyof typeof ballBearingStandardSizes,
    })
    expect(d.boreRadius).toBeLessThan(d.innerRaceOuterRadius)
    expect(d.innerRaceOuterRadius).toBeLessThan(d.outerRaceInnerRadius)
    expect(d.outerRaceInnerRadius).toBeLessThan(d.outerRadius)
    expect(d.ballRadius * 2).toBeLessThan(d.width)
    expect(2 * d.pitchRadius * Math.sin(Math.PI / d.ballCount)).toBeGreaterThan(
      2 * d.ballRadius,
    )
    expect(d.cageSeparatorHalfAngle).toBeGreaterThan(0)
  }
  expect(mp.string("ballbearing608").params().string).toBe(
    "ballbearing_id8mm_od22mm_w7mm_bothsidesopen",
  )
  expect(mp.string("ballbearing625zz").params().string).toBe(
    "ballbearing_id5mm_od16mm_w5mm_bothsidesshielded",
  )
  expect(mp.string("ballbearing625zz_topsideopen").params().string).toBe(
    "ballbearing_id5mm_od16mm_w5mm_topsideopen_bottomsideshielded",
  )
  expect(mp.string("ballbearing6002rs").json()).toMatchObject(
    faces("open", "sealed"),
  )
  expect(mp.string("ballbearing60022rs").json()).toMatchObject(faces("sealed"))
  for (const source of [
    "ballbearing",
    "ballbearing_id8mm_od22mm_w7mm_open",
    "BALLBEARING_INNERDIAMETER0.8CM_OUTERDIAMETER2.2CM_WIDTH7MM_BOTHSIDESOPEN",
    "ballbearing_code608_id0.8cm_od2.2cm_w0.7cm",
  ])
    expect(mp.string(source).json()).toEqual({
      fn: "ballbearing",
      ...ballBearingDefaults,
      ...faces("open"),
    })
  for (const [top, bottom] of ["open", "shielded", "sealed"].flatMap((top) =>
    ["open", "shielded", "sealed"].map((bottom) => [top, bottom]),
  )) {
    const source = `ballbearing625zz_topside${top}_bottomside${bottom}`
    expect(mp.string(source).json()).toMatchObject(faces(top!, bottom!))
    expect(
      mp
        .string(
          `ballbearing625_topside${top}_bothsidesshielded_bottomside${bottom}`,
        )
        .json(),
    ).toEqual(mp.string(source).json())
    expect(
      mp
        .string(
          `ballbearing625_bottomside${bottom}_bothsidesshielded_topside${top}`,
        )
        .json(),
    ).toEqual(mp.string(source).json())
  }
  expect(
    ballBearingModelPropsSchema.parse({
      innerDiameter: "0.25in",
      outerDiameter: "0.5in",
      width: "100mil",
    }),
  ).toEqual({
    innerDiameter: 6.35,
    outerDiameter: 12.7,
    width: 2.54,
    ...faces("open"),
  })
  for (const source of [
    "ballbearing_id0.0000001mm_od0.0000002mm_w0.0000001mm_open",
    "ballbearing_id1000000000000000000000mm_od2000000000000000000000mm_w1000000000000000000000mm_open",
  ]) {
    const canonical = mp.string(source).params().string
    expect(canonical).not.toMatch(/\de[+-]?\d/)
    expect(normalizeBallBearingModelString(canonical)).toBe(canonical)
    expect(mp.string(canonical).json()).toEqual(mp.string(source).json())
  }
  expect(mp.getModelNames()).toContain("ballbearing")
})
