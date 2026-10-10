import { expect, test } from "bun:test"
import { mp, flatGasketModelPropsSchema } from "../src"
test("flatgasket unit and token case normalization preserves dimensions", () => {
  expect(
    flatGasketModelPropsSchema.parse({
      innerDiameter: "2.0cm",
      outerDiameter: "3.5cm",
      thickness: "0.2cm",
      flatAnnulus: true,
    }),
  ).toEqual({
    innerDiameter: 20,
    outerDiameter: 35,
    thickness: 2,
    flatAnnulus: true,
  })
  expect(mp.string("FLATGASKET_ID20MM_OD35MM_T2MM_FLATANNULUS").json()).toEqual(
    mp.string("flatgasket_id20mm_od35mm_t2mm_flatannulus").json(),
  )
})
