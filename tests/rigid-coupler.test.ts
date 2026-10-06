import { test } from "bun:test"
import {
  assertRigidCouplerContract,
  assertRigidCouplerLayout,
  assertRigidCouplerValidation,
} from "./fixtures/assert-rigid-coupler"

test(
  "rigidcoupler resolves the public model and thread contract",
  assertRigidCouplerContract,
)
test(
  "rigidcoupler fixes the attachment hole positions and depths",
  assertRigidCouplerLayout,
)
test(
  "rigidcoupler rejects ambiguous tokens and impossible geometry",
  assertRigidCouplerValidation,
)
