import { test } from "bun:test"
import {
  assertClampingShaftCollarContract,
  assertClampingShaftCollarLayout,
  assertClampingShaftCollarValidation,
} from "./fixtures/assert-clamping-shaft-collar"

test(
  "clampingshaftcollar resolves the public model and thread contract",
  assertClampingShaftCollarContract,
)
test(
  "clampingshaftcollar fixes the attachment hole positions and depths",
  assertClampingShaftCollarLayout,
)
test(
  "clampingshaftcollar rejects ambiguous tokens and impossible geometry",
  assertClampingShaftCollarValidation,
)
