import { test } from "bun:test"
import {
  assertShaftCollarContract,
  assertShaftCollarLayout,
  assertShaftCollarValidation,
} from "./fixtures/assert-shaft-collar"

test(
  "shaftcollar resolves the public model and thread contract",
  assertShaftCollarContract,
)
test(
  "shaftcollar fixes the attachment hole positions and depths",
  assertShaftCollarLayout,
)
test(
  "shaftcollar rejects ambiguous tokens and impossible geometry",
  assertShaftCollarValidation,
)
