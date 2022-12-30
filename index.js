const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywkglu3.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const postsCollection = client.db("jobTaskSocialMedia").collection("posts");

    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.send(result);
    });

    app.get("/posts", async (req, res) => {
      const query = {};
      const posts = await postsCollection.find(query).toArray();
      res.send(posts);
    });

    app.patch("/post/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const upDoc = {
        $set: {
          like: +1,
        },
      };
      const result = await postsCollection.updateOne(filter, upDoc, options);
      res.send(result);
    });

    app.get("/homepost", async (req, res) => {
      const query = {};
      const cursor = await postsCollection.find(query).limit(3).toArray();
      res.send(cursor);
    });

    app.put("/posts/:id", async (req, res) => {
      const id = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const isLike = req.body.isLike;
      const upDoc = {
        $set: {
          isLike: isLike,
        },
      };
      const result = await postsCollection.updateOne(id, upDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run();

app.get("/", (req, res) => {
  res.send("job task social media server is running...");
});

app.listen(port, () => {
  console.log(`server is running on: ${port}`);
});
