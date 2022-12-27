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
        // if user has a partner
        if (userData.partner) {
        // if not all todos are verified, reset streak
        // get todos subcollection ref
          const todosRef = user.ref.collection("todos");
          // query todos subcollection for all todos
          const todos = await todosRef.get();
          // check if all todos are verified
          const allTodosVerified = todos.docs.every(
              (todo) => todo.data().verified,
          );
          // if not all todos are verified, reset streak
          if (!allTodosVerified) {
            await user.ref.update({
              streak: 0,
            });
          }
          // delete all todos
          return Promise.all(todos.docs.map((todo) => todo.ref.delete()));
        }
      }),
  );
};

const deleteImages = async () => {
  // delete users folder in storage
  const usersFolder = admin.storage().bucket().file("users");
  await usersFolder.delete();
};

// runs every day at 5:00am LA time
exports.dailyReset = functions.pubsub
    .schedule("0 5 * * *")
    .timeZone("America/Los_Angeles")
    .onRun(async (context) => {
      await Promise.all([resetStreaksAndDeleteTodos(), deleteImages()]);
    });
