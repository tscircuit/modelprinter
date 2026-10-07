import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  beltIdlerModelPropsSchema,
  getBeltIdlerDimensions,
  parseBeltIdlerModelParams,
} from "../src"
const example =
  "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm"
test("beltidler canonical string, dimensions, units and registration", () => {
  const expected = {
    fn: "beltidler",
    shape: "smooth",
    outerDiameter: 20,
    boreDiameter: 5,
    beltWidth: 10,
    beltThickness: 2.2,
    sideClearance: 1,
    flangeHeight: 3,
    flangeThickness: 1,
  } as const
  expect(mp.string(example).json()).toEqual(expected)
  expect(mp.string("beltidler").json()).toEqual(expected)
  expect(
    mp
      .string(
        "BELTIDLER_SHAPE(SMOOTH)_OUTERDIAMETER2cm_BOREDIAMETER0.005m_BELTWIDTH1cm_BELTTHICKNESS0.22cm_SIDECLEARANCE1mm_FLANGEHEIGHT0.3cm_FLANGETHICKNESS1mm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(modelprinter.getModelNames()).toContain("beltidler")
  const { fn, ...props } = expected
  expect(beltIdlerModelPropsSchema.parse(props)).toEqual(props)
  const d = getBeltIdlerDimensions(props)
  expect(d).toEqual({
    faceWidth: 12,
    contactRadius: 10,
    flangeDiameter: 26,
    totalWidth: 14,
    minZ: -1,
    maxZ: 13,
    radialWallThickness: 7.5,
    flangeAboveBelt: 0.7999999999999998,
  })
  expect(() =>
    parseBeltIdlerModelParams({ fn: "wrong", string: example }),
  ).toThrow()
})
