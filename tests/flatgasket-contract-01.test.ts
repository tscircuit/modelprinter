import { expect, test } from "bun:test"
import { mp, flatGasketModelPropsSchema, getFlatGasketDimensions } from "../src"
test("flatgasket complete strings and public dimensions agree", () => {
  const props = {
    innerDiameter: 20,
    outerDiameter: 35,
    thickness: 2,
    flatAnnulus: true,
  } as const
  expect(mp.string("flatgasket_id20mm_od35mm_t2mm_flatannulus").json()).toEqual(
    { fn: "flatgasket", ...props },
  )
  expect(
    mp.string("flatgasket_id20mm_od35mm_t2mm_profile(flatannulus)").json(),
  ).toEqual({ fn: "flatgasket", ...props })
  expect(flatGasketModelPropsSchema.parse(props)).toEqual(props)
  expect(getFlatGasketDimensions(props).size).toEqual([35, 35, 2])
})
