import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";
import { describe, beforeAll, it } from "vitest";

const PROJECT_ID = "dogether-78b6f";
const aliceUid = "alice";
const bobUid = "bob";

describe("Dogether", () => {
  let testEnv;
  let aliceUser, aliceUserDb;
  let bobUser, bobUserDb;
  let unauthenticatedUser, unauthenticatedUserDb;

  beforeAll(async () => {
    // Setup initial user data
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: fs.readFileSync("../firestore.rules", "utf8"),
        host: "127.0.0.1",
        port: 8080,
      },
    });

    // Create authenticated and unauthenticated users for testing
    aliceUser = testEnv.authenticatedContext(aliceUid);
    aliceUserDb = aliceUser.firestore();
    bobUser = testEnv.authenticatedContext(bobUid);
    bobUserDb = bobUser.firestore();
    unauthenticatedUser = testEnv.unauthenticatedContext();
    unauthenticatedUserDb = unauthenticatedUser.firestore();
  });

  // - READ: Allowed only for authenticated users
  // TODO: only allow read for email verified users
  it("Can view arbitrary user when logged in", async () => {
    // Authenticated user operation
    const readByAuthenticatedUser = aliceUserDb
      .collection("users")
      .doc("bob")
      .get();

    // Expect to Succeed
    await assertSucceeds(readByAuthenticatedUser);

    // Unauthenticated user operation
    const readByUnauthenticatedUser = unauthenticatedUserDb
      .collection("users")
      .doc("bob")
      .get();

    // Expect to Fail
    await assertFails(readByUnauthenticatedUser);
  });

  // - CREATE: Allowed only if user's uid is the same as the document's id
  it("Can create a user with the same uid as the document id", async () => {
    const userData = {
      displayName: "Alice",
      email: "alice@dogether.tech",
      partner: null,
      photoURL: "https://example.com/alice.png",
      streak: 0,
    };

    // Created by matching uid
    const createByMatchingUid = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .set(userData);

    // Expect to Succeed
    await assertSucceeds(createByMatchingUid);

    // Created by non-matching uid
    const createByNonMatchingUid = aliceUserDb
      .collection("users")
      .doc(bobUid)
      .set(userData);

    // Expect to Fail
    await assertFails(createByNonMatchingUid);

    // Unauthenticated user operation
    const createByUnauthenticatedUser = unauthenticatedUserDb
      .collection("users")
      .doc(aliceUid)
      .set(userData);

    // Expect to Fail
    await assertFails(createByUnauthenticatedUser);
  });

  // - CREATE: Must contain all required fields
  it("Can create a user with all required fields", async () => {
    const tooFewFields = {
      displayName: "Alice",
      email: "alice@dogether.tech",
      partner: null,
    };
    const justRightFields = {
      displayName: "Alice",
      email: "alice@dogether.tech",
      partner: null,
      photoURL: "https://example.com/alice.png",
      streak: 0,
    };
    const tooManyFields = {
      displayName: "Alice",
      email: "alice@dogether.tech",
      partner: null,
      photoURL: "https://example.com/alice.png",
      streak: 0,
      extraField: "extra",
    };

    // Created with too few fields
    const createWithTooFewFields = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .set(tooFewFields);

    // Expect to Fail
    await assertFails(createWithTooFewFields);

    // Created with just right fields
    const createWithJustRightFields = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .set(justRightFields);

    // Expect to Succeed
    await assertSucceeds(createWithJustRightFields);

    // Created with too many fields
    const createWithTooManyFields = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .set(tooManyFields);

    // Expect to Fail
    await assertFails(createWithTooManyFields);
  });
});
