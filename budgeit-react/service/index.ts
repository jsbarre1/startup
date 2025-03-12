import { UUID, User, Score } from "./types";

import * as bcrypt from "bcryptjs";
import * as uuid from "uuid";
import express from "express";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from 'express';

const app = express();

const authCookieName = "token";


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

async function findUser(
  key: "email" | "token",
  value: string
): Promise<User | null | undefined> {
  return users.find((user) => user[key] === value) || null;
}

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


function updateScores(newScore: Score) {
  const existingScoreIndex = scores.findIndex(score => score.userName === newScore.userName);
  
  if (existingScoreIndex !== -1) {
    scores[existingScoreIndex].score += newScore.score;
    
    scores.sort((a, b) => b.score - a.score);
  } else {
    let inserted = false;
    
    for (let i = 0; i < scores.length; i++) {
      if (newScore.score > scores[i].score) {
        scores.splice(i, 0, newScore);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      scores.push(newScore);
    }
  }
  
  if (scores.length > 10) {
    scores.length = 10;
  }
  console.log(scores);

  return scores;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ 
    type: err.name, 
    message: err.message 
  });
});

app.use((_req: Request, res: Response) => {
  res.sendFile("index.html", { root: "public" });
});


async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

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
