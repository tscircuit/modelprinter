import { expect, test } from "bun:test"
import {
  getNemaMotorReferencePoints,
  parseModelString,
  nemaMotorModelPropsSchema,
} from "../src"

test("NEMA references follow dimensions and wire angles independently of visibility", () => {
  for (const wireConnection of ["none", "stubs", "jst-ph-6"] as const) {
    const p = nemaMotorModelPropsSchema.parse({
      nemaSize: 17,
      bodyLength: 48,
      shaftLength: 30,
      wireSideAngle: 90,
      wireConnection,
    })
    const refs = getNemaMotorReferencePoints(p)
    expect(refs.backface.position).toEqual({ x: 0, y: 0, z: -48 })
    expect(refs.shafttip.position.z).toBe(30)
    expect(refs.wireside.position.x).toBeCloseTo(0)
    expect(refs.wireside.position.y).toBeCloseTo(21.15)
    expect(refs.wireside.position.z).toBe(-45.5)
    expect(refs.wireside.direction.y).toBeCloseTo(1)
  }
  const diagonal = getNemaMotorReferencePoints({
    nemaSize: 17,
    wireSideAngle: 45,
  }).wireside.position
  expect(diagonal.x + diagonal.y).toBeCloseTo(42.3 - 3)
  expect(getNemaMotorReferencePoints({ nemaSize: 8 }).shaftflat).toBeUndefined()
})

test("wire model strings parse, normalize and reject conflicting/invalid parameters", () => {
  expect(parseModelString("nema17_jstph6_wireangle-90deg")).toMatchObject({
    wireConnection: "jst-ph-6",
    wireSideAngle: 270,
  })
  expect(
    parseModelString(
      "nema17_wirestubs_wirecount6_wirelength8mm_wirediameter1mm",
    ),
  ).toMatchObject({
    wireConnection: "stubs",
    wireCount: 6,
    wireLength: 8,
    wireDiameter: 1,
  })
  expect(parseModelString("nema17_nowires")).toMatchObject({
    wireConnection: "none",
  })
  for (const model of [
    "nema17_jstph1",
    "nema17_nowires_wirestubs",
    "nema17_wireanglebad",
    "nema17_wirecount1",
    "nema17_wirediameter6mm",
    "nema17_wirelength0mm",
  ])
    expect(() => parseModelString(model)).toThrow()
})

test("JST PH and SH variants accept canonical and legacy spellings", () => {
  for (const family of ["ph", "sh"]) {
    const maxPins = family === "ph" ? 16 : 15
    for (let pinCount = 2; pinCount <= maxPins; pinCount++) {
      const definition = parseModelString(
        `nema17_jst${family}${pinCount}_wireangle90deg`,
      )
      if (definition.fn !== "nema") throw new Error("Expected NEMA")
      expect(definition.wireConnection).toBe(`jst-${family}-${pinCount}`)
      for (const alias of [
        `jst${pinCount}_${family}`,
        `jst_${family}_${pinCount}`,
        `jst-${family}-${pinCount}`,
      ]) {
        expect(parseModelString(`nema17_${alias}_wireangle90deg`)).toEqual(
          definition,
        )
        expect(
          parseModelString(`NEMA17_${alias.toUpperCase()}_wireangle90deg`),
        ).toEqual(definition)
      }
    }
  }
  for (const size of [8, 17, 23]) {
    for (const [alias, token] of [
      ["none", "nowires"],
      ["stubs", "wirestubs"],
    ])
      expect(parseModelString(`nema${size}_${alias}`)).toEqual(
        parseModelString(`nema${size}_${token}`),
      )
  }
  for (const model of [
    "nema17_jst4_ph_nowires",
    "nema17_jst-ph-4_jstph4",
    "nema17_jst4_ph_jst4_sh",
    "nema17_none_stubs",
    "nema17_jst1_ph",
    "nema17_jst17_ph",
    "nema17_jst16_sh",
    "nema17_jst4_xh",
    "nema17_jst4_sh_extra",
    "nema17_jst4_ph2",
    "nema17_jst0_sh",
    "nema8_jst16_ph",
  ])
    expect(() => parseModelString(model)).toThrow()
})
