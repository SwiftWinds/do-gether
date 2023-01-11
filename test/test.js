import {
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

const PROJECT_ID = "dogether-78b6f";

describe("Dogether", () => {
  it("Can view arbitrary user", async () => {
    const db = initializeTestEnvironment({
      projectId: PROJECT_ID,
    }).firestore();
    const alice = db.collection("users").doc("alice");
    await assertSucceeds(alice.get());
  });
});
