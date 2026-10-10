import { expect, test } from "bun:test"
import { mp, rectangularGasketModelPropsSchema } from "../src"
test("rectangulargasket rejects ambiguous and physically incompatible inputs", () => {
  const props = {
    width: 80,
    height: 50,
    border: 5,
    thickness: 2,
    cornerRadius: 5,
    flatFrame: true,
  } as const
  for (const source of [
    "rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe_unknown1mm",
    "rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe_profile(round)",
    "rectangulargasket",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    rectangularGasketModelPropsSchema.parse({ ...props, ...{ border: 25 } }),
  ).toThrow()
  expect(() =>
    rectangularGasketModelPropsSchema.parse({ ...props, width: Infinity }),
  ).toThrow()
  expect(() =>
    rectangularGasketModelPropsSchema.parse({ ...props, width: "12mmjunk" }),
  ).toThrow()
})
