import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import {
  jawCouplingModelPropsSchema,
  getJawCouplingDimensions,
} from "../src/models/jawcoupling"
import {
  beamCouplingModelPropsSchema,
  getBeamCouplingDimensions,
} from "../src/models/beamcoupling"
import {
  oldhamCouplingModelPropsSchema,
  getOldhamCouplingDimensions,
} from "../src/models/oldhamcoupling"
import {
  universalJointModelPropsSchema,
  getUniversalJointDimensions,
} from "../src/models/universaljoint"
import {
  bevelGearModelPropsSchema,
  getBevelGearDimensions,
} from "../src/models/bevelgear"

const contracts = [
  {
    name: "jawcoupling",
    source: "jawcoupling_od30mm_l40mm_bore8mm_hubl12mm_jawd12mm_jawcount3",
    schema: jawCouplingModelPropsSchema,
    invalid: [
      "bore21mm",
      "hubl20mm",
      "jawd8mm",
      "jawd17mm",
      "jawcount2",
      "jawcount3.5",
      "jawcount3mm",
    ],
  },
  {
    name: "beamcoupling",
    source:
      "beamcoupling_od25mm_l30mm_bore8mm_hubl7mm_slotw1mm_slots6_bridgeangle60",
    schema: beamCouplingModelPropsSchema,
    invalid: [
      "bore25mm",
      "hubl15mm",
      "slotw3mm",
      "slots1",
      "slots6.5",
      "slots6mm",
      "bridgeangle121",
      "bridgeangle60mm",
    ],
  },
  {
    name: "oldhamcoupling",
    source:
      "oldhamcoupling_od30mm_l36mm_bore8mm_hubl12mm_slotw7mm_slotd3mm_clearance0.2mm",
    schema: oldhamCouplingModelPropsSchema,
    invalid: [
      "bore18mm",
      "hubl18mm",
      "slotw21mm",
      "slotw0.4mm",
      "slotd12mm",
      "slotd0.4mm",
      "clearance-1mm",
    ],
  },
  {
    name: "universaljoint",
    source:
      "universaljoint_od30mm_l60mm_bore8mm_hubl14mm_armt5mm_crossd6mm_clearance0.2mm",
    schema: universalJointModelPropsSchema,
    invalid: [
      "armt10mm",
      "bore20mm",
      "hubl24mm",
      "crossd12mm",
      "clearance2.4mm",
      "clearance2.5mm",
    ],
  },
  {
    name: "bevelgear",
    source:
      "bevelgear_od40mm_td24mm_h14mm_bore8mm_depth3mm_hubd20mm_hubh8mm_teeth16",
    schema: bevelGearModelPropsSchema,
    invalid: [
      "td40mm",
      "depth8mm",
      "hubd25mm",
      "hubd8mm",
      "teeth5",
      "teeth16.5",
      "teeth16mm",
    ],
  },
] as const
for (const entry of contracts) {
  test(`${entry.name} defaults, full string, typed schema and registered definition agree`, () => {
    const definition = mp.string(entry.source).json()
    expect(definition.fn).toBe(entry.name)
    const { fn, ...props } = definition
    expect(props).toEqual(entry.schema.parse({}))
    expect(mp.string(entry.name).json()).toEqual(definition)
    expect(modelDefinitionSchema.parse(definition)).toEqual(definition)
    expect(mp.getModelNames()).toContain(entry.name)
    expect(mp.string(mp.string(entry.source).params().string).json()).toEqual(
      definition,
    )
  })
  test(`${entry.name} unit conversion and aliases preserve the normalized contract`, () => {
    const d = mp.string(entry.name).json()
    expect(
      mp
        .string(
          `${entry.name.toUpperCase()}_OUTERDIAMETER${entry.schema.parse({}).outerDiameter / 10}CM_BORE0.8CM`,
        )
        .json(),
    ).toEqual(d)
    expect(
      entry.schema.parse({ boreDiameter: "0.31496062992125984in" })
        .boreDiameter,
    ).toBeCloseTo(8)
    expect(
      entry.schema.parse({
        outerDiameter: entry.schema.parse({}).outerDiameter / 1000 + "m",
      }),
    ).toEqual(entry.schema.parse({}))
  })
  test(`${entry.name} rejects duplicate aliases, unknown tokens, malformed lengths and impossible geometry`, () => {
    for (const token of [
      "od0mm",
      "od-1mm",
      "od30mm_outerdiameter30mm",
      "od30mmjunk",
      "od1.2.3mm",
      "od",
      "typo1mm",
      ...entry.invalid,
    ])
      expect(() => mp.string(`${entry.name}_${token}`).json()).toThrow()
    expect(() => mp.string(`${entry.name}30`).json()).toThrow()
    for (const input of [
      { outerDiameter: Infinity },
      { boreDiameter: NaN },
      { outerDiameter: "oops" },
      { unknownProperty: 1 },
      { outerDiameter: 1.7e308, length: 1.7e308 },
    ])
      expect(() => entry.schema.parse(input)).toThrow()
  })
}

test("coupling datums and mechanical feature dimensions use millimeters", () => {
  expect(getJawCouplingDimensions({})).toMatchObject({
    size: [30, 30, 40],
    bottomZ: 0,
    topZ: 40,
    centralLength: 16,
    jawInnerRadius: 9.5,
  })
  expect(getBeamCouplingDimensions({})).toMatchObject({
    size: [25, 25, 30],
    bottomZ: 0,
    topZ: 30,
    flexureLength: 16,
    slotPitch: 16 / 7,
  })
  expect(getOldhamCouplingDimensions({})).toMatchObject({
    size: [30, 30, 36],
    diskThickness: 11.6,
    diskDiameter: 26.4,
    tongueWidth: 6.6,
    tongueHeight: 2.8,
  })
  expect(getUniversalJointDimensions({})).toMatchObject({
    size: [30, 30, 60],
    crossZ: 30,
    crossSpan: 25,
    earWidth: 10.8,
  })
  expect(getBevelGearDimensions({})).toMatchObject({
    size: [40, 40, 22],
    topZ: 22,
    pitchAngle: 22.5,
    rootDiameter: 34,
    topRootDiameter: 18,
  })
})
