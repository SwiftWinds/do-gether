const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const resetStreaksAndDeleteTodos = async () => {
  // get all users
  const users = await db.collection("users").get();
  // loop through all users
  return Promise.all(
      users.docs.map(async (user) => {
      // get user data
        const userData = user.data();
        // get todos subcollection ref
        const todosRef = user.ref.collection("todos");
        // query todos subcollection for all todos
        const todos = await todosRef.get();
        // if user has a partner
        if (userData.partner) {
          // if not all todos are verified, reset streak
          // check if all todos are verified
          const allTodosVerified = todos.docs.every(
              (todo) => todo.data().verified,
          );
          // if not all todos are verified, reset streak
          if (!allTodosVerified) {
            await user.ref.update({
              streak: 0,
            });
          } else if (todos.docs.length > 0) {
            // if there are at least 1 verified todo, increment streak
            await user.ref.update({
              streak: admin.firestore.FieldValue.increment(1),
            });
          }
        }
        // delete all todos
        return Promise.all(todos.docs.map((todo) => todo.ref.delete()));
      }),
  );
};

const deleteImages = async () => {
  // delete all files matching the pattern "users/{userId}/todos/{todoId}"
  const bucket = admin.storage().bucket();
  const [files] = await bucket.getFiles({
    prefix: "users",
  });
  return Promise.all(
      files.map((file) => {
        if (file.name.includes("todos")) {
          return file.delete();
        }
      }),
  );
};

// runs every day at 5:00am LA time
exports.dailyReset = functions.pubsub
    .schedule("0 5 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async () => {
      await Promise.all([resetStreaksAndDeleteTodos(), deleteImages()]);
    });
