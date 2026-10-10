import { expect, test } from "bun:test"
import { mp, flatGasketModelPropsSchema } from "../src"
test("flatgasket rejects ambiguous and physically incompatible inputs", () => {
  const props = {
    innerDiameter: 20,
    outerDiameter: 35,
    thickness: 2,
    flatAnnulus: true,
  } as const
  for (const source of [
    "flatgasket_id20mm_od35mm_t2mm_flatannulus_unknown1mm",
    "flatgasket_id20mm_od35mm_t2mm_flatannulus_id21mm",
    "flatgasket",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    flatGasketModelPropsSchema.parse({ ...props, ...{ innerDiameter: 35 } }),
  ).toThrow()
  expect(() =>
    flatGasketModelPropsSchema.parse({ ...props, innerDiameter: Infinity }),
  ).toThrow()
  expect(() =>
    flatGasketModelPropsSchema.parse({ ...props, innerDiameter: "12mmjunk" }),
  ).toThrow()
})
