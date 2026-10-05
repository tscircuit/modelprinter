import { expect } from "bun:test"
import {
  getClampingShaftCollarDimensions,
  clampingShaftCollarModelPropsSchema,
  clampingShaftCollarModelDefinitionSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../../src"

const example =
  "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4"
const props = {
  boreDiameter: 8,
  outerDiameter: 18,
  width: 9,
  splitWidth: 1,
  metricSize: "M4" as const,
}

export function assertClampingShaftCollarContract() {
  const model = mp.string(example).json()
  if (model.fn !== "clampingshaftcollar") throw new Error("Unexpected family")
  expect(model).toEqual({
    fn: "clampingshaftcollar",
    boreDiameter: 8,
    outerDiameter: 18,
    width: 9,
    splitWidth: 1,
    metricSize: "M4",
    mount: "singleclamp",
    threadPitch: 0.7,
    threadHand: "right",
    threadClass: "6H",
    screwZ: 4.5,
    clampX: 6.5,
    clearanceHoleDiameter: 4.5,
    chamfer: 0,
  })
  expect(mp.string(example).params()).toMatchObject({
    fn: "clampingshaftcollar",
    bore: "8mm",
    m: "4",
  })
  expect(modelprinter.getModelNames()).toContain("clampingshaftcollar")
  expect(clampingShaftCollarModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(
    mp
      .string(
        "CLAMPINGSHAFTCOLLAR_BORE0.8CM_OD1.8CM_W0.9CM_SPLIT0.1CM_MOUNT(SINGLECLAMP)_M4",
      )
      .json(),
  ).toEqual(model)
  expect(
    clampingShaftCollarModelPropsSchema.parse({
      ...props,
      boreDiameter: "0.31496062992125984in",
    }).boreDiameter,
  ).toBeCloseTo(8)
  expect(
    mp
      .string(example + "_threadpitch0.5mm_threadhand(left)_threadclass(6H)")
      .json(),
  ).toMatchObject({ threadPitch: 0.5, threadHand: "left", threadClass: "6H" })
  expect(
    clampingShaftCollarModelPropsSchema.parse({ ...props, metricSize: "M2.5" })
      .threadPitch,
  ).toBe(0.45)
}

export function assertClampingShaftCollarLayout() {
  const dimensions = getClampingShaftCollarDimensions(props)
  expect(dimensions.split).toEqual({
    xMin: 0,
    xMax: 9,
    yMin: -0.5,
    yMax: 0.5,
    zMin: 0,
    zMax: 9,
  })
  expect(dimensions.clearanceHole).toMatchObject({
    direction: [0, 1, 0],
    diameter: 4.5,
  })
  expect(dimensions.threadedHole).toMatchObject({
    start: [6.5, 0.5, 4.5],
    direction: [0, 1, 0],
    diameter: 4,
    threadPitch: 0.7,
    threadHand: "right",
    threadGender: "female",
  })
  expect(
    dimensions.clearanceHole.start[1] + dimensions.clearanceHole.depth,
  ).toBeCloseTo(-0.5)
  const threadEndY =
    dimensions.threadedHole.start[1] + dimensions.threadedHole.depth
  expect(threadEndY ** 2 + (6.5 - 2) ** 2).toBeCloseTo(9 ** 2)
  expect(dimensions.clearanceHole.start[1]).toBeCloseTo(
    -Math.sqrt(9 ** 2 - (6.5 - 2.25) ** 2),
  )
  expect(
    mp
      .string(example + "_screwz5mm_clampx6.6mm_clearance4.6mm_chamfer0.2mm")
      .json(),
  ).toMatchObject({
    screwZ: 5,
    clampX: 6.6,
    clearanceHoleDiameter: 4.6,
    chamfer: 0.2,
  })
}

export function assertClampingShaftCollarValidation() {
  for (const source of [
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_typo1mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_bore9mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_m3",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_mount(unknown)",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadpitch4mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadhand(opposed)",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadclass(6g)",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadpitch0mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadpitch0.7oops",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadpitch1e-3mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_mountsetscrew",
    "clampingshaftcollar_bore_od18mm_w9mm_split1mm_mount(singleclamp)_m4",
    "clampingshaftcollar_bore0mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4",
    "clampingshaftcollar_bore20mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4",
    "clampingshaftcollar_bore8mmoops_od18mm_w9mm_split1mm_mount(singleclamp)_m4",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m7",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_threadpitch(0.7mm)",
    "clampingshaftcollar(custom)_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4",
    "clampingshaftcollar",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_width9mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_screwz1mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_clampx5mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_clampx8mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_clearance4mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_clearance6mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4_chamfer3mm",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split8mm_mount(singleclamp)_m4",
    "clampingshaftcollar_bore8mm_od18mm_w9mm_split7mm_mount(singleclamp)_m4",
  ])
    expect(() => mp.string(source).json()).toThrow()
  for (const boreDiameter of [
    NaN,
    Infinity,
    -1,
    0,
    "8garbage",
    "(8mm)",
    true,
    1e200,
  ]) {
    expect(() =>
      clampingShaftCollarModelPropsSchema.parse({ ...props, boreDiameter }),
    ).toThrow()
  }
  expect(() =>
    clampingShaftCollarModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
  expect(() =>
    clampingShaftCollarModelPropsSchema.parse({
      ...props,
      outerDiameter: 1e200,
    }),
  ).toThrow()
}
