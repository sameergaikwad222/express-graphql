import express from "express";
import connectMongoDB from "./database/database.js";
const app = express();
import config from "./config/config.json" assert { type: "json" };
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
const PORT = config?.PORT || 3000;

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.use("/", (req, res) => {
  return res.status(200).json({
    message: "Express Server is running as healthy. 👍👍👍",
  });
});

async function initApp() {
  try {
    await connectMongoDB();
    app.listen(PORT, () =>
      console.log(
        `App is running on http://localhost:${PORT}| GraphQL Server is running on http://localhost:${PORT}/graphql`
      )
    );
  } catch (error) {
    console.log("Error while starting an application", error.message);
  }
}

initApp();
