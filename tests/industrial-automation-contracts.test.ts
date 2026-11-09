import { expect, test } from "bun:test"
import { mp } from "../src"
import {
  pneumaticCylinderModelPropsSchema,
  pneumaticCylinderModelDefinitionSchema,
  getPneumaticCylinderDimensions,
} from "../src/models/pneumaticcylinder"
import {
  cylinderMountModelPropsSchema,
  cylinderMountModelDefinitionSchema,
  getCylinderMountDimensions,
} from "../src/models/cylindermount"
import {
  airFilterModelPropsSchema,
  airFilterModelDefinitionSchema,
  getAirFilterDimensions,
} from "../src/models/airfilter"
import {
  airRegulatorModelPropsSchema,
  airRegulatorModelDefinitionSchema,
  getAirRegulatorDimensions,
} from "../src/models/airregulator"
import {
  airLubricatorModelPropsSchema,
  airLubricatorModelDefinitionSchema,
  getAirLubricatorDimensions,
} from "../src/models/airlubricator"
import {
  solenoidValveModelPropsSchema,
  solenoidValveModelDefinitionSchema,
  getSolenoidValveDimensions,
} from "../src/models/solenoidvalve"
import {
  pressureSwitchModelPropsSchema,
  pressureSwitchModelDefinitionSchema,
  getPressureSwitchDimensions,
} from "../src/models/pressureswitch"
import {
  pressureGaugeModelPropsSchema,
  pressureGaugeModelDefinitionSchema,
  getPressureGaugeDimensions,
} from "../src/models/pressuregauge"
import {
  flowMeterModelPropsSchema,
  flowMeterModelDefinitionSchema,
  getFlowMeterDimensions,
} from "../src/models/flowmeter"
import {
  vacuumCupModelPropsSchema,
  vacuumCupModelDefinitionSchema,
  getVacuumCupDimensions,
} from "../src/models/vacuumcup"
import {
  inductiveProximitySensorModelPropsSchema,
  inductiveProximitySensorModelDefinitionSchema,
  getInductiveProximitySensorDimensions,
} from "../src/models/inductiveproximitysensor"
import {
  photoelectricSensorModelPropsSchema,
  photoelectricSensorModelDefinitionSchema,
  getPhotoelectricSensorDimensions,
} from "../src/models/photoelectricsensor"
import {
  limitSwitchModelPropsSchema,
  limitSwitchModelDefinitionSchema,
  getLimitSwitchDimensions,
} from "../src/models/limitswitch"
import {
  pushbuttonOperatorModelPropsSchema,
  pushbuttonOperatorModelDefinitionSchema,
  getPushbuttonOperatorDimensions,
} from "../src/models/pushbuttonoperator"
import {
  emergencyStopSwitchModelPropsSchema,
  emergencyStopSwitchModelDefinitionSchema,
  getEmergencyStopSwitchDimensions,
} from "../src/models/emergencystopswitch"
import {
  selectorOperatorModelPropsSchema,
  selectorOperatorModelDefinitionSchema,
  getSelectorOperatorDimensions,
} from "../src/models/selectoroperator"
import {
  pilotLightModelPropsSchema,
  pilotLightModelDefinitionSchema,
  getPilotLightDimensions,
} from "../src/models/pilotlight"
import {
  dinRailModelPropsSchema,
  dinRailModelDefinitionSchema,
  getDinRailDimensions,
} from "../src/models/dinrail"
import {
  terminalBlockModelPropsSchema,
  terminalBlockModelDefinitionSchema,
  getTerminalBlockDimensions,
} from "../src/models/terminalblock"
import {
  wireDuctModelPropsSchema,
  wireDuctModelDefinitionSchema,
  getWireDuctDimensions,
} from "../src/models/wireduct"
test("pneumaticcylinder: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "pneumaticcylinder",
    ...{
      boreDiameter: 32,
      bodyLength: 80,
      rodDiameter: 12,
      stroke: 50,
      extension: 25,
      endCapLength: 10,
      portDiameter: 6,
    },
  }
  expect<unknown>(
    mp
      .string(
        "pneumaticcylinder_borediameter32mm_bodylength80mm_roddiameter12mm_stroke50mm_extension25mm_endcaplength10mm_portdiameter6mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PNEUMATICCYLINDER_BOREDIAMETER32MM_BODYLENGTH80MM_RODDIAMETER12MM_STROKE50MM_EXTENSION25MM_ENDCAPLENGTH10MM_PORTDIAMETER6MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("pneumaticcylinder").json()).toEqual(expected)
  expect<unknown>(
    pneumaticCylinderModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    pneumaticCylinderModelPropsSchema.parse({
      ...props,
      boreDiameter: "3.2cm",
    }),
  ).toEqual(props)
  expect<unknown>(
    getPneumaticCylinderDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_borediameter1mm",
    "_borediameter1e2",
    "_borediameter1mmjunk",
    "_borediameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "pneumaticcylinder_borediameter32mm_bodylength80mm_roddiameter12mm_stroke50mm_extension25mm_endcaplength10mm_portdiameter6mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      pneumaticCylinderModelPropsSchema.parse({
        ...props,
        boreDiameter: value,
      }),
    ).toThrow()
  expect<unknown>(() =>
    pneumaticCylinderModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    pneumaticCylinderModelPropsSchema.parse({ ...props, ...{ extension: 51 } }),
  ).toThrow()
})

test("cylindermount: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "cylindermount",
    ...{
      width: 50,
      depth: 25,
      height: 45,
      thickness: 5,
      boreDiameter: 20,
      holeDiameter: 5,
    },
  }
  expect<unknown>(
    mp
      .string(
        "cylindermount_width50mm_depth25mm_height45mm_thickness5mm_borediameter20mm_holediameter5mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "CYLINDERMOUNT_WIDTH50MM_DEPTH25MM_HEIGHT45MM_THICKNESS5MM_BOREDIAMETER20MM_HOLEDIAMETER5MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("cylindermount").json()).toEqual(expected)
  expect<unknown>(cylinderMountModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    cylinderMountModelPropsSchema.parse({ ...props, width: "5.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getCylinderMountDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "cylindermount_width50mm_depth25mm_height45mm_thickness5mm_borediameter20mm_holediameter5mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      cylinderMountModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    cylinderMountModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    cylinderMountModelPropsSchema.parse({ ...props, ...{ boreDiameter: 42 } }),
  ).toThrow()
})

test("airfilter: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "airfilter",
    ...{
      bodyWidth: 40,
      bodyDepth: 40,
      bodyHeight: 30,
      bowlDiameter: 28,
      bowlLength: 50,
      portDiameter: 8,
      drainLength: 8,
    },
  }
  expect<unknown>(
    mp
      .string(
        "airfilter_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_drainlength8mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "AIRFILTER_BODYWIDTH40MM_BODYDEPTH40MM_BODYHEIGHT30MM_BOWLDIAMETER28MM_BOWLLENGTH50MM_PORTDIAMETER8MM_DRAINLENGTH8MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("airfilter").json()).toEqual(expected)
  expect<unknown>(airFilterModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    airFilterModelPropsSchema.parse({ ...props, bodyWidth: "4.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getAirFilterDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_bodywidth1mm",
    "_bodywidth1e2",
    "_bodywidth1mmjunk",
    "_bodywidth",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "airfilter_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_drainlength8mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      airFilterModelPropsSchema.parse({ ...props, bodyWidth: value }),
    ).toThrow()
  expect<unknown>(() =>
    airFilterModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    airFilterModelPropsSchema.parse({ ...props, ...{ bowlDiameter: 45 } }),
  ).toThrow()
})

test("airregulator: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "airregulator",
    ...{
      bodyWidth: 40,
      bodyDepth: 36,
      bodyHeight: 30,
      knobDiameter: 28,
      knobHeight: 20,
      portDiameter: 8,
      gaugeDiameter: 20,
    },
  }
  expect<unknown>(
    mp
      .string(
        "airregulator_bodywidth40mm_bodydepth36mm_bodyheight30mm_knobdiameter28mm_knobheight20mm_portdiameter8mm_gaugediameter20mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "AIRREGULATOR_BODYWIDTH40MM_BODYDEPTH36MM_BODYHEIGHT30MM_KNOBDIAMETER28MM_KNOBHEIGHT20MM_PORTDIAMETER8MM_GAUGEDIAMETER20MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("airregulator").json()).toEqual(expected)
  expect<unknown>(airRegulatorModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    airRegulatorModelPropsSchema.parse({ ...props, bodyWidth: "4.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getAirRegulatorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_bodywidth1mm",
    "_bodywidth1e2",
    "_bodywidth1mmjunk",
    "_bodywidth",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "airregulator_bodywidth40mm_bodydepth36mm_bodyheight30mm_knobdiameter28mm_knobheight20mm_portdiameter8mm_gaugediameter20mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      airRegulatorModelPropsSchema.parse({ ...props, bodyWidth: value }),
    ).toThrow()
  expect<unknown>(() =>
    airRegulatorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    airRegulatorModelPropsSchema.parse({ ...props, ...{ knobDiameter: 38 } }),
  ).toThrow()
})

test("airlubricator: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "airlubricator",
    ...{
      bodyWidth: 40,
      bodyDepth: 40,
      bodyHeight: 30,
      bowlDiameter: 28,
      bowlLength: 50,
      portDiameter: 8,
      fillDiameter: 12,
      fillHeight: 8,
    },
  }
  expect<unknown>(
    mp
      .string(
        "airlubricator_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_filldiameter12mm_fillheight8mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "AIRLUBRICATOR_BODYWIDTH40MM_BODYDEPTH40MM_BODYHEIGHT30MM_BOWLDIAMETER28MM_BOWLLENGTH50MM_PORTDIAMETER8MM_FILLDIAMETER12MM_FILLHEIGHT8MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("airlubricator").json()).toEqual(expected)
  expect<unknown>(airLubricatorModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    airLubricatorModelPropsSchema.parse({ ...props, bodyWidth: "4.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getAirLubricatorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_bodywidth1mm",
    "_bodywidth1e2",
    "_bodywidth1mmjunk",
    "_bodywidth",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "airlubricator_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_filldiameter12mm_fillheight8mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      airLubricatorModelPropsSchema.parse({ ...props, bodyWidth: value }),
    ).toThrow()
  expect<unknown>(() =>
    airLubricatorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    airLubricatorModelPropsSchema.parse({ ...props, ...{ fillDiameter: 25 } }),
  ).toThrow()
})

test("solenoidvalve: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "solenoidvalve",
    ...{
      length: 70,
      width: 28,
      height: 25,
      coilWidth: 24,
      coilHeight: 30,
      portDiameter: 6,
    },
  }
  expect<unknown>(
    mp
      .string(
        "solenoidvalve_length70mm_width28mm_height25mm_coilwidth24mm_coilheight30mm_portdiameter6mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "SOLENOIDVALVE_LENGTH70MM_WIDTH28MM_HEIGHT25MM_COILWIDTH24MM_COILHEIGHT30MM_PORTDIAMETER6MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("solenoidvalve").json()).toEqual(expected)
  expect<unknown>(solenoidValveModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    solenoidValveModelPropsSchema.parse({ ...props, length: "7.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getSolenoidValveDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_length1mm",
    "_length1e2",
    "_length1mmjunk",
    "_length",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "solenoidvalve_length70mm_width28mm_height25mm_coilwidth24mm_coilheight30mm_portdiameter6mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      solenoidValveModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect<unknown>(() =>
    solenoidValveModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    solenoidValveModelPropsSchema.parse({ ...props, ...{ coilWidth: 40 } }),
  ).toThrow()
})

test("pressureswitch: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "pressureswitch",
    ...{ width: 32, depth: 28, height: 38, portDiameter: 8, portLength: 10 },
  }
  expect<unknown>(
    mp
      .string(
        "pressureswitch_width32mm_depth28mm_height38mm_portdiameter8mm_portlength10mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PRESSURESWITCH_WIDTH32MM_DEPTH28MM_HEIGHT38MM_PORTDIAMETER8MM_PORTLENGTH10MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("pressureswitch").json()).toEqual(expected)
  expect<unknown>(pressureSwitchModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    pressureSwitchModelPropsSchema.parse({ ...props, width: "3.2cm" }),
  ).toEqual(props)
  expect<unknown>(
    getPressureSwitchDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "pressureswitch_width32mm_depth28mm_height38mm_portdiameter8mm_portlength10mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      pressureSwitchModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    pressureSwitchModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    pressureSwitchModelPropsSchema.parse({ ...props, ...{ portDiameter: 18 } }),
  ).toThrow()
})

test("pressuregauge: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "pressuregauge",
    ...{ diameter: 60, depth: 22, stemDiameter: 10, stemLength: 15 },
  }
  expect<unknown>(
    mp
      .string(
        "pressuregauge_diameter60mm_depth22mm_stemdiameter10mm_stemlength15mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PRESSUREGAUGE_DIAMETER60MM_DEPTH22MM_STEMDIAMETER10MM_STEMLENGTH15MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("pressuregauge").json()).toEqual(expected)
  expect<unknown>(pressureGaugeModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    pressureGaugeModelPropsSchema.parse({ ...props, diameter: "6.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getPressureGaugeDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_diameter1mm",
    "_diameter1e2",
    "_diameter1mmjunk",
    "_diameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "pressuregauge_diameter60mm_depth22mm_stemdiameter10mm_stemlength15mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      pressureGaugeModelPropsSchema.parse({ ...props, diameter: value }),
    ).toThrow()
  expect<unknown>(() =>
    pressureGaugeModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    pressureGaugeModelPropsSchema.parse({ ...props, ...{ stemDiameter: 22 } }),
  ).toThrow()
})

test("flowmeter: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "flowmeter",
    ...{
      length: 120,
      diameter: 24,
      boreDiameter: 12,
      endDiameter: 32,
      endLength: 12,
      floatDiameter: 8,
    },
  }
  expect<unknown>(
    mp
      .string(
        "flowmeter_length120mm_diameter24mm_borediameter12mm_enddiameter32mm_endlength12mm_floatdiameter8mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "FLOWMETER_LENGTH120MM_DIAMETER24MM_BOREDIAMETER12MM_ENDDIAMETER32MM_ENDLENGTH12MM_FLOATDIAMETER8MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("flowmeter").json()).toEqual(expected)
  expect<unknown>(flowMeterModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    flowMeterModelPropsSchema.parse({ ...props, length: "12.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getFlowMeterDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_length1mm",
    "_length1e2",
    "_length1mmjunk",
    "_length",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "flowmeter_length120mm_diameter24mm_borediameter12mm_enddiameter32mm_endlength12mm_floatdiameter8mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      flowMeterModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect<unknown>(() =>
    flowMeterModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    flowMeterModelPropsSchema.parse({ ...props, ...{ floatDiameter: 14 } }),
  ).toThrow()
})

test("vacuumcup: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "vacuumcup",
    ...{
      diameter: 35,
      height: 22,
      neckDiameter: 12,
      neckLength: 12,
      wallThickness: 2,
      boreDiameter: 6,
    },
  }
  expect<unknown>(
    mp
      .string(
        "vacuumcup_diameter35mm_height22mm_neckdiameter12mm_necklength12mm_wallthickness2mm_borediameter6mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "VACUUMCUP_DIAMETER35MM_HEIGHT22MM_NECKDIAMETER12MM_NECKLENGTH12MM_WALLTHICKNESS2MM_BOREDIAMETER6MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("vacuumcup").json()).toEqual(expected)
  expect<unknown>(vacuumCupModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    vacuumCupModelPropsSchema.parse({ ...props, diameter: "3.5cm" }),
  ).toEqual(props)
  expect<unknown>(
    getVacuumCupDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_diameter1mm",
    "_diameter1e2",
    "_diameter1mmjunk",
    "_diameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "vacuumcup_diameter35mm_height22mm_neckdiameter12mm_necklength12mm_wallthickness2mm_borediameter6mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      vacuumCupModelPropsSchema.parse({ ...props, diameter: value }),
    ).toThrow()
  expect<unknown>(() =>
    vacuumCupModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    vacuumCupModelPropsSchema.parse({ ...props, ...{ boreDiameter: 10 } }),
  ).toThrow()
})

test("inductiveproximitysensor: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "inductiveproximitysensor",
    ...{
      barrelDiameter: 18,
      barrelLength: 55,
      faceThickness: 2,
      cableDiameter: 5,
      cableLength: 15,
      nutWidth: 22,
      nutThickness: 4,
    },
  }
  expect<unknown>(
    mp
      .string(
        "inductiveproximitysensor_barreldiameter18mm_barrellength55mm_facethickness2mm_cablediameter5mm_cablelength15mm_nutwidth22mm_nutthickness4mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "INDUCTIVEPROXIMITYSENSOR_BARRELDIAMETER18MM_BARRELLENGTH55MM_FACETHICKNESS2MM_CABLEDIAMETER5MM_CABLELENGTH15MM_NUTWIDTH22MM_NUTTHICKNESS4MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("inductiveproximitysensor").json()).toEqual(
    expected,
  )
  expect<unknown>(
    inductiveProximitySensorModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    inductiveProximitySensorModelPropsSchema.parse({
      ...props,
      barrelDiameter: "1.8cm",
    }),
  ).toEqual(props)
  expect<unknown>(
    getInductiveProximitySensorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_barreldiameter1mm",
    "_barreldiameter1e2",
    "_barreldiameter1mmjunk",
    "_barreldiameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "inductiveproximitysensor_barreldiameter18mm_barrellength55mm_facethickness2mm_cablediameter5mm_cablelength15mm_nutwidth22mm_nutthickness4mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      inductiveProximitySensorModelPropsSchema.parse({
        ...props,
        barrelDiameter: value,
      }),
    ).toThrow()
  expect<unknown>(() =>
    inductiveProximitySensorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    inductiveProximitySensorModelPropsSchema.parse({
      ...props,
      ...{ nutWidth: 16 },
    }),
  ).toThrow()
})

test("photoelectricsensor: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "photoelectricsensor",
    ...{
      width: 20,
      depth: 35,
      height: 55,
      lensDiameter: 12,
      cableDiameter: 5,
      mountHoleDiameter: 4,
    },
  }
  expect<unknown>(
    mp
      .string(
        "photoelectricsensor_width20mm_depth35mm_height55mm_lensdiameter12mm_cablediameter5mm_mountholediameter4mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PHOTOELECTRICSENSOR_WIDTH20MM_DEPTH35MM_HEIGHT55MM_LENSDIAMETER12MM_CABLEDIAMETER5MM_MOUNTHOLEDIAMETER4MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("photoelectricsensor").json()).toEqual(expected)
  expect<unknown>(
    photoelectricSensorModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    photoelectricSensorModelPropsSchema.parse({ ...props, width: "2.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getPhotoelectricSensorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "photoelectricsensor_width20mm_depth35mm_height55mm_lensdiameter12mm_cablediameter5mm_mountholediameter4mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      photoelectricSensorModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    photoelectricSensorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    photoelectricSensorModelPropsSchema.parse({
      ...props,
      ...{ lensDiameter: 20 },
    }),
  ).toThrow()
})

test("limitswitch: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "limitswitch",
    ...{
      width: 30,
      depth: 20,
      height: 55,
      actuatorLength: 30,
      rollerDiameter: 12,
      leverThickness: 3,
      holeDiameter: 4,
    },
  }
  expect<unknown>(
    mp
      .string(
        "limitswitch_width30mm_depth20mm_height55mm_actuatorlength30mm_rollerdiameter12mm_leverthickness3mm_holediameter4mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "LIMITSWITCH_WIDTH30MM_DEPTH20MM_HEIGHT55MM_ACTUATORLENGTH30MM_ROLLERDIAMETER12MM_LEVERTHICKNESS3MM_HOLEDIAMETER4MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("limitswitch").json()).toEqual(expected)
  expect<unknown>(limitSwitchModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    limitSwitchModelPropsSchema.parse({ ...props, width: "3.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getLimitSwitchDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "limitswitch_width30mm_depth20mm_height55mm_actuatorlength30mm_rollerdiameter12mm_leverthickness3mm_holediameter4mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      limitSwitchModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    limitSwitchModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    limitSwitchModelPropsSchema.parse({ ...props, ...{ rollerDiameter: 35 } }),
  ).toThrow()
})

test("pushbuttonoperator: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "pushbuttonoperator",
    ...{
      panelDiameter: 22,
      bezelDiameter: 30,
      buttonDiameter: 22,
      bodyLength: 35,
      buttonHeight: 8,
    },
  }
  expect<unknown>(
    mp
      .string(
        "pushbuttonoperator_paneldiameter22mm_bezeldiameter30mm_buttondiameter22mm_bodylength35mm_buttonheight8mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PUSHBUTTONOPERATOR_PANELDIAMETER22MM_BEZELDIAMETER30MM_BUTTONDIAMETER22MM_BODYLENGTH35MM_BUTTONHEIGHT8MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("pushbuttonoperator").json()).toEqual(expected)
  expect<unknown>(
    pushbuttonOperatorModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    pushbuttonOperatorModelPropsSchema.parse({
      ...props,
      panelDiameter: "2.2cm",
    }),
  ).toEqual(props)
  expect<unknown>(
    getPushbuttonOperatorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_paneldiameter1mm",
    "_paneldiameter1e2",
    "_paneldiameter1mmjunk",
    "_paneldiameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "pushbuttonoperator_paneldiameter22mm_bezeldiameter30mm_buttondiameter22mm_bodylength35mm_buttonheight8mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      pushbuttonOperatorModelPropsSchema.parse({
        ...props,
        panelDiameter: value,
      }),
    ).toThrow()
  expect<unknown>(() =>
    pushbuttonOperatorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    pushbuttonOperatorModelPropsSchema.parse({
      ...props,
      ...{ buttonDiameter: 30 },
    }),
  ).toThrow()
})

test("emergencystopswitch: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "emergencystopswitch",
    ...{
      panelDiameter: 22,
      headDiameter: 40,
      bodyLength: 45,
      headHeight: 18,
      collarDiameter: 30,
    },
  }
  expect<unknown>(
    mp
      .string(
        "emergencystopswitch_paneldiameter22mm_headdiameter40mm_bodylength45mm_headheight18mm_collardiameter30mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "EMERGENCYSTOPSWITCH_PANELDIAMETER22MM_HEADDIAMETER40MM_BODYLENGTH45MM_HEADHEIGHT18MM_COLLARDIAMETER30MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("emergencystopswitch").json()).toEqual(expected)
  expect<unknown>(
    emergencyStopSwitchModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    emergencyStopSwitchModelPropsSchema.parse({
      ...props,
      panelDiameter: "2.2cm",
    }),
  ).toEqual(props)
  expect<unknown>(
    getEmergencyStopSwitchDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_paneldiameter1mm",
    "_paneldiameter1e2",
    "_paneldiameter1mmjunk",
    "_paneldiameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "emergencystopswitch_paneldiameter22mm_headdiameter40mm_bodylength45mm_headheight18mm_collardiameter30mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      emergencyStopSwitchModelPropsSchema.parse({
        ...props,
        panelDiameter: value,
      }),
    ).toThrow()
  expect<unknown>(() =>
    emergencyStopSwitchModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    emergencyStopSwitchModelPropsSchema.parse({
      ...props,
      ...{ headDiameter: 28 },
    }),
  ).toThrow()
})

test("selectoroperator: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "selectoroperator",
    ...{
      panelDiameter: 22,
      bezelDiameter: 30,
      bodyLength: 35,
      knobWidth: 28,
      knobDepth: 10,
      knobHeight: 15,
    },
  }
  expect<unknown>(
    mp
      .string(
        "selectoroperator_paneldiameter22mm_bezeldiameter30mm_bodylength35mm_knobwidth28mm_knobdepth10mm_knobheight15mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "SELECTOROPERATOR_PANELDIAMETER22MM_BEZELDIAMETER30MM_BODYLENGTH35MM_KNOBWIDTH28MM_KNOBDEPTH10MM_KNOBHEIGHT15MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("selectoroperator").json()).toEqual(expected)
  expect<unknown>(
    selectorOperatorModelDefinitionSchema.parse(expected),
  ).toEqual(expected)
  const { fn, ...props } = expected
  expect<unknown>(
    selectorOperatorModelPropsSchema.parse({
      ...props,
      panelDiameter: "2.2cm",
    }),
  ).toEqual(props)
  expect<unknown>(
    getSelectorOperatorDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_paneldiameter1mm",
    "_paneldiameter1e2",
    "_paneldiameter1mmjunk",
    "_paneldiameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "selectoroperator_paneldiameter22mm_bezeldiameter30mm_bodylength35mm_knobwidth28mm_knobdepth10mm_knobheight15mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      selectorOperatorModelPropsSchema.parse({
        ...props,
        panelDiameter: value,
      }),
    ).toThrow()
  expect<unknown>(() =>
    selectorOperatorModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    selectorOperatorModelPropsSchema.parse({ ...props, ...{ knobDepth: 30 } }),
  ).toThrow()
})

test("pilotlight: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "pilotlight",
    ...{ panelDiameter: 22, lensDiameter: 28, bodyLength: 28, lensHeight: 8 },
  }
  expect<unknown>(
    mp
      .string(
        "pilotlight_paneldiameter22mm_lensdiameter28mm_bodylength28mm_lensheight8mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "PILOTLIGHT_PANELDIAMETER22MM_LENSDIAMETER28MM_BODYLENGTH28MM_LENSHEIGHT8MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("pilotlight").json()).toEqual(expected)
  expect<unknown>(pilotLightModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    pilotLightModelPropsSchema.parse({ ...props, panelDiameter: "2.2cm" }),
  ).toEqual(props)
  expect<unknown>(
    getPilotLightDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_paneldiameter1mm",
    "_paneldiameter1e2",
    "_paneldiameter1mmjunk",
    "_paneldiameter",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "pilotlight_paneldiameter22mm_lensdiameter28mm_bodylength28mm_lensheight8mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      pilotLightModelPropsSchema.parse({ ...props, panelDiameter: value }),
    ).toThrow()
  expect<unknown>(() =>
    pilotLightModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    pilotLightModelPropsSchema.parse({ ...props, ...{ lensDiameter: 20 } }),
  ).toThrow()
})

test("dinrail: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "dinrail",
    ...{
      width: 35,
      height: 7.5,
      thickness: 1,
      length: 100,
      holeDiameter: 5,
      slotLength: 10,
      slotPitch: 25,
    },
  }
  expect<unknown>(
    mp
      .string(
        "dinrail_width35mm_height7.5mm_thickness1mm_length100mm_holediameter5mm_slotlength10mm_slotpitch25mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "DINRAIL_WIDTH35MM_HEIGHT7.5MM_THICKNESS1MM_LENGTH100MM_HOLEDIAMETER5MM_SLOTLENGTH10MM_SLOTPITCH25MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("dinrail").json()).toEqual(expected)
  expect<unknown>(dinRailModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    dinRailModelPropsSchema.parse({ ...props, width: "3.5cm" }),
  ).toEqual(props)
  expect<unknown>(
    getDinRailDimensions(props).size.every((v) => Number.isFinite(v) && v > 0),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "dinrail_width35mm_height7.5mm_thickness1mm_length100mm_holediameter5mm_slotlength10mm_slotpitch25mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      dinRailModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    dinRailModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    dinRailModelPropsSchema.parse({ ...props, ...{ slotPitch: 10 } }),
  ).toThrow()
})

test("terminalblock: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "terminalblock",
    ...{ width: 6, depth: 40, height: 35, wireDiameter: 3, screwDiameter: 4 },
  }
  expect<unknown>(
    mp
      .string(
        "terminalblock_width6mm_depth40mm_height35mm_wirediameter3mm_screwdiameter4mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "TERMINALBLOCK_WIDTH6MM_DEPTH40MM_HEIGHT35MM_WIREDIAMETER3MM_SCREWDIAMETER4MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("terminalblock").json()).toEqual(expected)
  expect<unknown>(terminalBlockModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    terminalBlockModelPropsSchema.parse({ ...props, width: "0.6cm" }),
  ).toEqual(props)
  expect<unknown>(
    getTerminalBlockDimensions(props).size.every(
      (v) => Number.isFinite(v) && v > 0,
    ),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "terminalblock_width6mm_depth40mm_height35mm_wirediameter3mm_screwdiameter4mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      terminalBlockModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    terminalBlockModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    terminalBlockModelPropsSchema.parse({ ...props, ...{ screwDiameter: 6 } }),
  ).toThrow()
})

test("wireduct: strict typed schema, units and registry contract", () => {
  const expected = {
    fn: "wireduct",
    ...{
      width: 40,
      height: 40,
      length: 100,
      thickness: 2,
      slotWidth: 4,
      slotPitch: 8,
      holeDiameter: 5,
    },
  }
  expect<unknown>(
    mp
      .string(
        "wireduct_width40mm_height40mm_length100mm_thickness2mm_slotwidth4mm_slotpitch8mm_holediameter5mm",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(
    mp
      .string(
        "WIREDUCT_WIDTH40MM_HEIGHT40MM_LENGTH100MM_THICKNESS2MM_SLOTWIDTH4MM_SLOTPITCH8MM_HOLEDIAMETER5MM",
      )
      .json(),
  ).toEqual(expected)
  expect<unknown>(mp.string("wireduct").json()).toEqual(expected)
  expect<unknown>(wireDuctModelDefinitionSchema.parse(expected)).toEqual(
    expected,
  )
  const { fn, ...props } = expected
  expect<unknown>(
    wireDuctModelPropsSchema.parse({ ...props, width: "4.0cm" }),
  ).toEqual(props)
  expect<unknown>(
    getWireDuctDimensions(props).size.every((v) => Number.isFinite(v) && v > 0),
  ).toBe(true)
  for (const suffix of [
    "_typo1mm",
    "_width1mm",
    "_width1e2",
    "_width1mmjunk",
    "_width",
    "__",
  ])
    expect<unknown>(() =>
      mp
        .string(
          "wireduct_width40mm_height40mm_length100mm_thickness2mm_slotwidth4mm_slotpitch8mm_holediameter5mm" +
            suffix,
        )
        .json(),
    ).toThrow()
  for (const value of [
    0,
    -1,
    Infinity,
    NaN,
    "9".repeat(400) + "mm",
    "1mmjunk",
    "1e2",
    "(2mm)",
  ])
    expect<unknown>(() =>
      wireDuctModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect<unknown>(() =>
    wireDuctModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
  expect<unknown>(() =>
    wireDuctModelPropsSchema.parse({ ...props, ...{ slotWidth: 9 } }),
  ).toThrow()
})

test("repeated rail and duct patterns reject excessive feature counts", () => {
  expect<unknown>(() =>
    dinRailModelPropsSchema.parse({
      length: 100,
      slotPitch: 0.01,
      slotLength: 0.005,
      holeDiameter: 0.003,
    }),
  ).toThrow()
  expect<unknown>(() =>
    wireDuctModelPropsSchema.parse({
      length: 100,
      slotPitch: 0.01,
      slotWidth: 0.005,
    }),
  ).toThrow()
  expect<unknown>(() =>
    wireDuctModelPropsSchema.parse({ length: 12801, slotPitch: 30 }),
  ).toThrow()
})
