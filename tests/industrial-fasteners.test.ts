import { expect, test } from "bun:test"
import { ModelRegistry } from "../src/model-registry"
import { parseModelStringParams } from "../src/parse-model-string"
import {
  flatWasherModelPropsSchema,
  getFlatWasherDimensions,
} from "../src/models/flatwasher"
import { parseFlatWasherModelParams } from "../src/models/flatwasher/parse-model-string"
import { model as flatWasherRegistration } from "../src/models/flatwasher/register"
import {
  toothedWasherModelPropsSchema,
  getToothedWasherDimensions,
} from "../src/models/toothedwasher"
import { parseToothedWasherModelParams } from "../src/models/toothedwasher/parse-model-string"
import { model as toothedWasherRegistration } from "../src/models/toothedwasher/register"
import {
  waveWasherModelPropsSchema,
  getWaveWasherDimensions,
} from "../src/models/wavewasher"
import { parseWaveWasherModelParams } from "../src/models/wavewasher/parse-model-string"
import { model as waveWasherRegistration } from "../src/models/wavewasher/register"
import {
  bellevilleWasherModelPropsSchema,
  getBellevilleWasherDimensions,
} from "../src/models/bellevillewasher"
import { parseBellevilleWasherModelParams } from "../src/models/bellevillewasher/parse-model-string"
import { model as bellevilleWasherRegistration } from "../src/models/bellevillewasher/register"
import {
  shoulderBoltModelPropsSchema,
  getShoulderBoltDimensions,
} from "../src/models/shoulderbolt"
import { parseShoulderBoltModelParams } from "../src/models/shoulderbolt/parse-model-string"
import { model as shoulderBoltRegistration } from "../src/models/shoulderbolt/register"
import { uBoltModelPropsSchema, getUBoltDimensions } from "../src/models/ubolt"
import { parseUBoltModelParams } from "../src/models/ubolt/parse-model-string"
import { model as uBoltRegistration } from "../src/models/ubolt/register"
import {
  eyeBoltModelPropsSchema,
  getEyeBoltDimensions,
} from "../src/models/eyebolt"
import { parseEyeBoltModelParams } from "../src/models/eyebolt/parse-model-string"
import { model as eyeBoltRegistration } from "../src/models/eyebolt/register"
import {
  carriageBoltModelPropsSchema,
  getCarriageBoltDimensions,
} from "../src/models/carriagebolt"
import { parseCarriageBoltModelParams } from "../src/models/carriagebolt/parse-model-string"
import { model as carriageBoltRegistration } from "../src/models/carriagebolt/register"
import {
  wingNutModelPropsSchema,
  getWingNutDimensions,
} from "../src/models/wingnut"
import { parseWingNutModelParams } from "../src/models/wingnut/parse-model-string"
import { model as wingNutRegistration } from "../src/models/wingnut/register"
import {
  capNutModelPropsSchema,
  getCapNutDimensions,
} from "../src/models/capnut"
import { parseCapNutModelParams } from "../src/models/capnut/parse-model-string"
import { model as capNutRegistration } from "../src/models/capnut/register"
import {
  couplingNutModelPropsSchema,
  getCouplingNutDimensions,
} from "../src/models/couplingnut"
import { parseCouplingNutModelParams } from "../src/models/couplingnut/parse-model-string"
import { model as couplingNutRegistration } from "../src/models/couplingnut/register"
import {
  tSlotNutModelPropsSchema,
  getTSlotNutDimensions,
} from "../src/models/tslotnut"
import { parseTSlotNutModelParams } from "../src/models/tslotnut/parse-model-string"
import { model as tSlotNutRegistration } from "../src/models/tslotnut/register"
import {
  rivetNutModelPropsSchema,
  getRivetNutDimensions,
} from "../src/models/rivetnut"
import { parseRivetNutModelParams } from "../src/models/rivetnut/parse-model-string"
import { model as rivetNutRegistration } from "../src/models/rivetnut/register"
import {
  solidRivetModelPropsSchema,
  getSolidRivetDimensions,
} from "../src/models/solidrivet"
import { parseSolidRivetModelParams } from "../src/models/solidrivet/parse-model-string"
import { model as solidRivetRegistration } from "../src/models/solidrivet/register"
import {
  blindRivetModelPropsSchema,
  getBlindRivetDimensions,
} from "../src/models/blindrivet"
import { parseBlindRivetModelParams } from "../src/models/blindrivet/parse-model-string"
import { model as blindRivetRegistration } from "../src/models/blindrivet/register"
import {
  clevisPinModelPropsSchema,
  getClevisPinDimensions,
} from "../src/models/clevispin"
import { parseClevisPinModelParams } from "../src/models/clevispin/parse-model-string"
import { model as clevisPinRegistration } from "../src/models/clevispin/register"
import {
  springPinModelPropsSchema,
  getSpringPinDimensions,
} from "../src/models/springpin"
import { parseSpringPinModelParams } from "../src/models/springpin/parse-model-string"
import { model as springPinRegistration } from "../src/models/springpin/register"
import {
  taperPinModelPropsSchema,
  getTaperPinDimensions,
} from "../src/models/taperpin"
import { parseTaperPinModelParams } from "../src/models/taperpin/parse-model-string"
import { model as taperPinRegistration } from "../src/models/taperpin/register"
import {
  retainingRingModelPropsSchema,
  getRetainingRingDimensions,
} from "../src/models/retainingring"
import { parseRetainingRingModelParams } from "../src/models/retainingring/parse-model-string"
import { model as retainingRingRegistration } from "../src/models/retainingring/register"
import {
  hairpinCotterModelPropsSchema,
  getHairpinCotterDimensions,
} from "../src/models/hairpincotter"
import { parseHairpinCotterModelParams } from "../src/models/hairpincotter/parse-model-string"
import { model as hairpinCotterRegistration } from "../src/models/hairpincotter/register"
const cases = [
  {
    name: "flatwasher",
    schema: flatWasherModelPropsSchema,
    parse: parseFlatWasherModelParams,
    defaults: getFlatWasherDimensions(),
    registration: flatWasherRegistration,
    example: "flatwasher_id6.4mm_od12mm_t1.6mm",
    key: "innerDiameter",
    alias: "id",
    invalid: { innerDiameter: 13 },
  },
  {
    name: "toothedwasher",
    schema: toothedWasherModelPropsSchema,
    parse: parseToothedWasherModelParams,
    defaults: getToothedWasherDimensions(),
    registration: toothedWasherRegistration,
    example: "toothedwasher_id6.4mm_od13mm_t0.8mm_td1.5mm",
    key: "innerDiameter",
    alias: "id",
    invalid: { toothDepth: 5 },
  },
  {
    name: "wavewasher",
    schema: waveWasherModelPropsSchema,
    parse: parseWaveWasherModelParams,
    defaults: getWaveWasherDimensions(),
    registration: waveWasherRegistration,
    example: "wavewasher_id10mm_od16mm_t0.6mm_wh1.5mm",
    key: "innerDiameter",
    alias: "id",
    invalid: { innerDiameter: 17 },
  },
  {
    name: "bellevillewasher",
    schema: bellevilleWasherModelPropsSchema,
    parse: parseBellevilleWasherModelParams,
    defaults: getBellevilleWasherDimensions(),
    registration: bellevilleWasherRegistration,
    example: "bellevillewasher_id6.4mm_od14mm_t0.8mm_ch1.5mm",
    key: "innerDiameter",
    alias: "id",
    invalid: { innerDiameter: 15 },
  },
  {
    name: "shoulderbolt",
    schema: shoulderBoltModelPropsSchema,
    parse: parseShoulderBoltModelParams,
    defaults: getShoulderBoltDimensions(),
    registration: shoulderBoltRegistration,
    example: "shoulderbolt_sd8mm_sl20mm_td6mm_tl10mm_hd13mm_hh5mm",
    key: "shoulderDiameter",
    alias: "sd",
    invalid: { threadDiameter: 9 },
  },
  {
    name: "ubolt",
    schema: uBoltModelPropsSchema,
    parse: parseUBoltModelParams,
    defaults: getUBoltDimensions(),
    registration: uBoltRegistration,
    example: "ubolt_d6mm_s30mm_l35mm",
    key: "rodDiameter",
    alias: "d",
    invalid: { rodDiameter: 31 },
  },
  {
    name: "eyebolt",
    schema: eyeBoltModelPropsSchema,
    parse: parseEyeBoltModelParams,
    defaults: getEyeBoltDimensions(),
    registration: eyeBoltRegistration,
    example: "eyebolt_d6mm_l24mm_id14mm_wd5mm",
    key: "shaftDiameter",
    alias: "d",
    invalid: { eyeWireDiameter: 15 },
  },
  {
    name: "carriagebolt",
    schema: carriageBoltModelPropsSchema,
    parse: parseCarriageBoltModelParams,
    defaults: getCarriageBoltDimensions(),
    registration: carriageBoltRegistration,
    example: "carriagebolt_d6mm_l25mm_nw6.5mm_nh3mm_hd14mm_hh4mm",
    key: "shaftDiameter",
    alias: "d",
    invalid: { neckWidth: 11 },
  },
  {
    name: "wingnut",
    schema: wingNutModelPropsSchema,
    parse: parseWingNutModelParams,
    defaults: getWingNutDimensions(),
    registration: wingNutRegistration,
    example: "wingnut_id6mm_af10mm_h5mm_s28mm_wh10mm_wt3mm",
    key: "boreDiameter",
    alias: "id",
    invalid: { wingSpan: 8 },
  },
  {
    name: "capnut",
    schema: capNutModelPropsSchema,
    parse: parseCapNutModelParams,
    defaults: getCapNutDimensions(),
    registration: capNutRegistration,
    example: "capnut_id6mm_af10mm_h5mm_ch5mm_wt1mm",
    key: "boreDiameter",
    alias: "id",
    invalid: { wallThickness: 3 },
  },
  {
    name: "couplingnut",
    schema: couplingNutModelPropsSchema,
    parse: parseCouplingNutModelParams,
    defaults: getCouplingNutDimensions(),
    registration: couplingNutRegistration,
    example: "couplingnut_id6mm_af10mm_h18mm",
    key: "boreDiameter",
    alias: "id",
    invalid: { height: 9 },
  },
  {
    name: "tslotnut",
    schema: tSlotNutModelPropsSchema,
    parse: parseTSlotNutModelParams,
    defaults: getTSlotNutDimensions(),
    registration: tSlotNutRegistration,
    example: "tslotnut_id6mm_w16mm_l20mm_bh4mm_nw10mm_nh4mm",
    key: "boreDiameter",
    alias: "id",
    invalid: { neckWidth: 17 },
  },
  {
    name: "rivetnut",
    schema: rivetNutModelPropsSchema,
    parse: parseRivetNutModelParams,
    defaults: getRivetNutDimensions(),
    registration: rivetNutRegistration,
    example: "rivetnut_id6mm_d9mm_l14mm_fd12mm_ft1.5mm",
    key: "boreDiameter",
    alias: "id",
    invalid: { boreDiameter: 10 },
  },
  {
    name: "solidrivet",
    schema: solidRivetModelPropsSchema,
    parse: parseSolidRivetModelParams,
    defaults: getSolidRivetDimensions(),
    registration: solidRivetRegistration,
    example: "solidrivet_d4mm_l12mm_hd8mm_hh2.5mm",
    key: "shaftDiameter",
    alias: "d",
    invalid: { shaftDiameter: 9 },
  },
  {
    name: "blindrivet",
    schema: blindRivetModelPropsSchema,
    parse: parseBlindRivetModelParams,
    defaults: getBlindRivetDimensions(),
    registration: blindRivetRegistration,
    example: "blindrivet_d4mm_l10mm_fd8mm_ft1.2mm_md2mm_ml20mm",
    key: "bodyDiameter",
    alias: "d",
    invalid: { mandrelDiameter: 5 },
  },
  {
    name: "clevispin",
    schema: clevisPinModelPropsSchema,
    parse: parseClevisPinModelParams,
    defaults: getClevisPinDimensions(),
    registration: clevisPinRegistration,
    example: "clevispin_d6mm_l25mm_hd10mm_hh2mm_hol2mm_ho3mm",
    key: "shaftDiameter",
    alias: "d",
    invalid: { holeOffset: 0.5 },
  },
  {
    name: "springpin",
    schema: springPinModelPropsSchema,
    parse: parseSpringPinModelParams,
    defaults: getSpringPinDimensions(),
    registration: springPinRegistration,
    example: "springpin_od6mm_l20mm_wt1mm_g1mm",
    key: "outerDiameter",
    alias: "od",
    invalid: { wallThickness: 4 },
  },
  {
    name: "taperpin",
    schema: taperPinModelPropsSchema,
    parse: parseTaperPinModelParams,
    defaults: getTaperPinDimensions(),
    registration: taperPinRegistration,
    example: "taperpin_ld6mm_sd5mm_l30mm",
    key: "largeDiameter",
    alias: "ld",
    invalid: { smallDiameter: 7 },
  },
  {
    name: "retainingring",
    schema: retainingRingModelPropsSchema,
    parse: parseRetainingRingModelParams,
    defaults: getRetainingRingDimensions(),
    registration: retainingRingRegistration,
    example: "retainingring_id16mm_od20mm_t1.2mm_g5mm_ld4mm_hol1.5mm",
    key: "innerDiameter",
    alias: "id",
    invalid: { holeDiameter: 5 },
  },
  {
    name: "hairpincotter",
    schema: hairpinCotterModelPropsSchema,
    parse: parseHairpinCotterModelParams,
    defaults: getHairpinCotterDimensions(),
    registration: hairpinCotterRegistration,
    example: "hairpincotter_d2mm_l40mm_ld10mm",
    key: "wireDiameter",
    alias: "d",
    invalid: { length: 10 },
  },
]
for (const entry of cases) {
  test(`${entry.name} has typed defaults and its explicit dimensional string routes through its registration`, () => {
    const actual = entry.parse(parseModelStringParams(entry.example))
    expect<unknown>(actual).toEqual({ fn: entry.name, ...entry.defaults })
    expect(entry.parse(parseModelStringParams(entry.name))).toEqual(actual)
    const registry = new ModelRegistry()
    registry.register(
      entry.registration as Parameters<ModelRegistry["register"]>[0],
    )
    expect<unknown>(
      registry.parse(parseModelStringParams(entry.example)),
    ).toEqual(actual)
  })
  test(`${entry.name} accepts equivalent inch and centimeter inputs`, () => {
    const defaults = entry.defaults as Record<string, number>
    const inches = Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        `${value / 25.4}in`,
      ]),
    )
    const centimeters = Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [key, `${value / 10}cm`]),
    )
    for (const input of [inches, centimeters]) {
      const p = entry.schema.parse(input) as Record<string, number>
      for (const [key, value] of Object.entries(defaults))
        expect(p[key]).toBeCloseTo(value, 9)
    }
    const token = entry.alias + String(defaults[entry.key]! / 25.4) + "in"
    const parsed = entry.parse(
      parseModelStringParams(`${entry.name}_${token}`),
    ) as unknown as Record<string, number>
    expect(parsed[entry.key]).toBeCloseTo(defaults[entry.key]!, 9)
  })
  test(`${entry.name} rejects ambiguous tokens, invalid units and impossible dimensions`, () => {
    for (const value of [0, -1, NaN, Infinity, 0.000001, 10001])
      for (const key of Object.keys(entry.defaults))
        expect(entry.schema.safeParse({ [key]: value }).success).toBe(false)
    expect(entry.schema.safeParse(entry.invalid).success).toBe(false)
    expect(entry.schema.safeParse({ unknown: 1 }).success).toBe(false)
    for (const suffix of [
      "unknown5",
      `${entry.alias}1watts`,
      `${entry.alias}NaN`,
      `${entry.alias}5mm_${entry.key.toLowerCase()}5mm`,
    ])
      expect(() =>
        entry.parse(parseModelStringParams(`${entry.name}_${suffix}`)),
      ).toThrow()
    expect(() =>
      entry.parse(parseModelStringParams(`${entry.name}1`)),
    ).toThrow()
  })
}

test("thin fastener walls and intersecting retention features fail before rendering", () => {
  for (const [schema, props] of [
    [flatWasherModelPropsSchema, { innerDiameter: 11.999999 }],
    [toothedWasherModelPropsSchema, { innerDiameter: 9.999999 }],
    [wingNutModelPropsSchema, { boreDiameter: 9.999999 }],
    [capNutModelPropsSchema, { wallThickness: 1.999999 }],
    [rivetNutModelPropsSchema, { boreDiameter: 8.8 }],
    [blindRivetModelPropsSchema, { mandrelDiameter: 3.8 }],
    [clevisPinModelPropsSchema, { holeOffset: 1.000001 }],
    [springPinModelPropsSchema, { gapWidth: 3.999999 }],
    [taperPinModelPropsSchema, { smallDiameter: 5.999999 }],
    [retainingRingModelPropsSchema, { gapWidth: 4.000001 }],
  ] as const)
    expect(schema.safeParse(props).success).toBe(false)
})
