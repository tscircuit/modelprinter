import { expect, test } from "bun:test"
import { mp, solidRivetModelPropsSchema } from "../src"

test("solid rivet selectors are boolean flags with no enum aliases", () => {
  const base = "solidrivet_d3mm_l10mm_headod5.5mm_headh2.2mm"
  const model = mp.string(`${base}_custom_roundhead_flattail_unset`).json()
  expect(model).toMatchObject({
    custom: true,
    roundHead: true,
    flatTail: true,
    unset: true,
  })
  expect(model).not.toHaveProperty("specification")
  expect(mp.string(base).json()).toEqual(model)
  for (const selector of [
    "spec(custom)",
    "head(round)",
    "tail(flat)",
    "state(unset)",
    "custom_custom",
    "custom(true)",
  ])
    expect(() => mp.string(`${base}_${selector}`).json()).toThrow()
  expect(() =>
    solidRivetModelPropsSchema.parse({
      diameter: 3,
      length: 10,
      headDiameter: 5.5,
      headHeight: 2.2,
      specification: "custom",
    }),
  ).toThrow()
})
