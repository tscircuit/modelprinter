import { expect, test } from "bun:test"
import { mp, hatSectionModelPropsSchema } from "../src"
import { props, source } from "./fixtures/hatsection"
test("hatsection 2: aliases, case, and mixed length units normalize", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "hatsection",
    ...props,
  })
  expect(
    hatSectionModelPropsSchema.parse({ ...props, crownWidth: "4.0cm" }),
  ).toEqual(props)
})
