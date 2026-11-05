import { expect, test } from "bun:test"
import { anglePlateModelPropsSchema } from "../src"
import { props } from "./fixtures/angleplate"

test("angleplate preserves material around its six bores and inside corner", () => {
  for (const change of [
    { innerRadius: 68 },
    { thickness: 80 },
    { basePitchX: 8 },
    { basePitchY: 8 },
    { basePitchX: 92 },
    { basePitchY: 60 },
    { facePitch: 8 },
    { facePitch: 92 },
    { faceHeight: 16 },
    { faceHeight: 96 },
    { innerRadius: 10, basePitchY: 50 },
  ]) {
    expect(() =>
      anglePlateModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  }
  expect(
    anglePlateModelPropsSchema.parse({
      ...props,
      basePitchY: 59.9,
      faceHeight: 95.9,
    }),
  ).toMatchObject({ basePitchY: 59.9, faceHeight: 95.9 })
})
