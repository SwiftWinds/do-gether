import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";
import { describe, beforeAll, it, afterAll } from "vitest";

const PROJECT_ID = "dogether-78b6f";
const aliceUid = "alice";
const bobUid = "bob";

describe("Dogether", () => {
  let testEnv;
  let aliceUser, aliceUserDb;
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
    unauthenticatedUser = testEnv.unauthenticatedContext();
    unauthenticatedUserDb = unauthenticatedUser.firestore();
  });

  afterAll(async () => {
    await testEnv.cleanup();
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

  // - UPDATE: Allowed only if user's uid is the same as the document's id
  it("Can update a user with the same uid as the document id", async () => {
    const userData = {
      displayName: "Alice",
      email: "alice@dogether.tech",
      partner: null,
      photoURL: "https://example.com/alice.png",
      streak: 0,
    };

    // Updated by matching uid
    const updateByMatchingUid = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .update(userData);

    // Expect to Succeed
    await assertSucceeds(updateByMatchingUid);

    // Updated by non-matching uid
    const updateByNonMatchingUid = aliceUserDb
      .collection("users")
      .doc(bobUid)
      .update(userData);

    // Expect to Fail
    await assertFails(updateByNonMatchingUid);

    // Unauthenticated user operation
    const updateByUnauthenticatedUser = unauthenticatedUserDb
      .collection("users")
      .doc(aliceUid)
      .update(userData);

    // Expect to Fail
    await assertFails(updateByUnauthenticatedUser);
  });

  // - DELETE: Allowed only if user's uid is the same as the document's id
  it("Can delete a user with the same uid as the document id", async () => {
    // Deleted by matching uid
    const deleteByMatchingUid = aliceUserDb
      .collection("users")
      .doc(aliceUid)
      .delete();

    // Expect to Succeed
    await assertSucceeds(deleteByMatchingUid);

    // Deleted by non-matching uid
    const deleteByNonMatchingUid = aliceUserDb
      .collection("users")
      .doc(bobUid)
      .delete();

    // Expect to Fail
    await assertFails(deleteByNonMatchingUid);

    // Unauthenticated user operation
    const deleteByUnauthenticatedUser = unauthenticatedUserDb
      .collection("users")
      .doc(aliceUid)
      .delete();

    // Expect to Fail
    await assertFails(deleteByUnauthenticatedUser);
  });
});
