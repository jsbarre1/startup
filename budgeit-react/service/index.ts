import { UUID, User, Score } from "./types";

const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const {MongoClient} = require('mongodb')
const config = require('./dbConfig.json')

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`
import { Request, Response, NextFunction } from 'express';

const client = new MongoClient(url)
const db = client.db('startup');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');

const app = express();

const authCookieName = "token";

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

async function findUser(key: "email" | "token", value: string): Promise<User | null> {
  if (key === "email") {
    return await userCollection.findOne({ email: value });
  } else {
    return await userCollection.findOne({ token: value });
  }
}

async function createUser(email: string, password: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    email: email,
    password: passwordHash,
    token: uuid.v4() as UUID,
  };
  
  await userCollection.insertOne(user);
  return user;
}

async function updateUserToken(email: string, token: UUID | null) {
  if (token) {
    await userCollection.updateOne({ email }, { $set: { token } });
  } else {
    await userCollection.updateOne({ email }, { $unset: { token: "" } });
  }
}

// MongoDB score operations
async function getHighScores(): Promise<Score[]> {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  return await scoreCollection.find(query, options).toArray();
}

async function updateScores(newScore: Score): Promise<Score[]> {
  // Find if user already has a score
  const existingScore = await scoreCollection.findOne({ userName: newScore.userName });
  
  if (existingScore) {
    // Update existing score
    await scoreCollection.updateOne(
      { userName: newScore.userName },
      { $set: { score: existingScore.score + newScore.score } }
    );
  } else {
    // Insert new score
    await scoreCollection.insertOne(newScore);
  }
  
  // Return top 10 scores
  return await getHighScores();
}


let users: User[] = [];
let scores: Score[] = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static("public"));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post("/auth/create", async (req: Request, res: Response) => {
  if (await findUser("email", req.body.email)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});



apiRouter.post("/auth/login", async (req: Request, res: Response) => {
  const user = await findUser("email", req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).send({ msg: "Unauthorized" });
    return;
  }

  user.token = uuid.v4() as UUID;
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.delete("/auth/logout", async (req: Request, res: Response) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

apiRouter.get("/scores", verifyAuth, (_req: Request, res: Response) => {
  res.send(scores);
});

apiRouter.post("/score", verifyAuth, (req: Request, res: Response) => {
  scores = updateScores(req.body);
  res.send(scores);
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ 
    type: err.name, 
    message: err.message 
  });
});

app.use((_req: Request, res: Response) => {
  res.sendFile("index.html", { root: "public" });
});

function setAuthCookie(
  res: Response,
  authToken: UUID | undefined
) {
  if (authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });
  }
}



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
