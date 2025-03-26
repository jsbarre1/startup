import { UUID, User, Score, Transaction } from "./types";
import { Request, Response, NextFunction } from 'express';

const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const {MongoClient} = require('mongodb')
const config = require('./dbConfig.json')

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`

const client = new MongoClient(url)
const db = client.db('startup');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');
const transactionCollection = db.collection('transaction');

const app = express();

const authCookieName = "token";

(async function testConnection() {
  try {
    await client.connect(); 
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
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

async function getHighScores(): Promise<Score[]> {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  return await scoreCollection.find(query, options).toArray();
}

async function updateScores(newScore: Score): Promise<Score[]> {
  const existingScore = await scoreCollection.findOne({ userName: newScore.userName });
  
  if (existingScore) {
    await scoreCollection.updateOne(
      { userName: newScore.userName },
      { $set: { score: existingScore.score + newScore.score } }
    );
  } else {
    await scoreCollection.insertOne(newScore);
  }
  
  return await getHighScores();
}

async function addTransaction(transaction: Transaction): Promise<void> {
  const processedTransaction = {
    ...transaction,
    date: new Date(transaction.date)
  };
  
  await transactionCollection.insertOne(processedTransaction);
}

async function getTransactions(userName: string): Promise<Transaction[]> {
  const query = { userName: userName };
  
  const transactions = await transactionCollection.find(query).toArray();
  
  console.log(`Found ${transactions.length} transactions for user ${userName}`);
  
  return transactions;
}

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post("/auth/create", async (req: Request, res: Response) => {
  try {
    const existingUser = await findUser("email", req.body.email);
    
    if (existingUser) {
      res.status(409).send({ msg: "Existing user" });
    } else {
      const user = await createUser(req.body.email, req.body.password);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ msg: "Error creating user" });
  }
});

apiRouter.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const user = await findUser("email", req.body.email);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      res.status(401).send({ msg: "Unauthorized" });
      return;
    }

    const token = uuid.v4() as UUID;
    await updateUserToken(user.email, token);
    setAuthCookie(res, token);
    res.send({ email: user.email });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ msg: "Error during login" });
  }
});

apiRouter.delete("/auth/logout", async (req: Request, res: Response) => {
  try {
    const user = await findUser("token", req.cookies[authCookieName]);
    if (user) {
      await updateUserToken(user.email, null);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ msg: "Error during logout" });
  }
});

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[authCookieName];
    if (!token) {
      res.status(401).send({ msg: "No authentication token" });
      return;
    }
    
    const user = await findUser("token", token);
    if (user) {
      req.body.userToken = token;
      next();
    } else {
      res.status(401).send({ msg: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying authentication:", error);
    res.status(500).send({ msg: "Error verifying authentication" });
  }
};

apiRouter.get("/scores", verifyAuth, async (_req: Request, res: Response) => {
  try {
    const scores = await getHighScores();
    res.send(scores);
  } catch (error) {
    console.error("Error retrieving scores:", error);
    res.status(500).send({ msg: "Error retrieving scores" });
  }
});

apiRouter.post("/score", verifyAuth, async (req: Request, res: Response) => {
  try {
    const scores = await updateScores(req.body);
    res.send(scores);
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).send({ msg: "Error updating score" });
  }
});

apiRouter.get("/transactions", verifyAuth, async (req: Request, res: Response) => {
  try {    
    if (!req.cookies[authCookieName]) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    
    const userName = req.query.userName as string;
    if (!userName) {
      return res.status(400).send({ msg: "userName is required" });
    }
    
    const transactions = await getTransactions(userName);
    res.send(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).send({ msg: "Error retrieving transactions" });
  }
});

apiRouter.post("/transaction", verifyAuth, async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    
    if (!userName) {
      return res.status(400).send({ msg: "userName is required" });
    }
    
    console.log("Adding transaction for user:", userName);
    
    const transaction = req.body;
    
    console.log("Transaction to add:", transaction);
    
    await addTransaction(transaction);
    res.send({ msg: "Transaction added successfully" });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).send({ msg: "Error adding transaction" });
  }
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Application error:", err);
  res.status(500).send({ 
    type: err.name, 
    message: err.message 
  });
});

app.use((_req: Request, res: Response) => {
  res.sendFile("index.html", { root: "public" });
});

function setAuthCookie(res: Response, authToken: UUID | undefined) {
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