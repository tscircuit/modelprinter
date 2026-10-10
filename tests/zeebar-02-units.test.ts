import { expect, test } from "bun:test"
import { mp, zeeBarModelPropsSchema } from "../src"
import { props, source } from "./fixtures/zeebar"
test("zeebar 2: aliases, case, and mixed length units normalize", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "zeebar",
    ...props,
  })
  expect(zeeBarModelPropsSchema.parse({ ...props, height: "3.0cm" })).toEqual(
    props,
  )
})
