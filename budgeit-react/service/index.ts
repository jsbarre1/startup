import { UUID } from "crypto";
import { Score, User } from "./types";

const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
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

apiRouter.post(
  "/auth/create",
  async (
    req: { body: { email: string; password: string } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: { msg: string }): void; new (): any };
      };
      send: (arg0: { email: string }) => void;
    }
  ) => {
    if (await findUser("email", req.body.email)) {
      res.status(409).send({ msg: "Existing user" });
    } else {
      const user = await createUser(req.body.email, req.body.password);

      setAuthCookie(res, user.token);
      res.send({ email: user.email });
    }
  }
);

async function findUser(
  key: "email" | "token",
  value: string
): Promise<User | null | undefined> {
  return users.find((user) => user[key] === value) || null;
}

apiRouter.post(
  "/auth/login",
  async (
    req: { body: { email: string; password: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: { msg: string }): void; new (): any };
      };
      send: (arg0: { email: string }) => void;
    }
  ) => {
    const user = await findUser("email", req.body.email);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      res.status(401).send({ msg: "Unauthorized" });
      return;
    }

    user.token = uuid.v4() as UUID;
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
);

apiRouter.delete(
  "/auth/logout",
  async (
    req: { cookies: { [x: string]: string } },
    res: {
      clearCookie: (arg0: string) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        end: { (): void; new (): any };
      };
    }
  ) => {
    const user = await findUser("token", req.cookies[authCookieName]);
    if (user) {
      delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  }
);

const verifyAuth = async (
  req: { cookies: { [x: string]: string } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: { msg: string }): void; new (): any };
    };
  },
  next: () => void
) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

apiRouter.get(
  "/scores",
  verifyAuth,
  (_req: any, res: { send: (arg0: Score[]) => void }) => {
    res.send(scores);
  }
);

apiRouter.post(
  "/score",
  verifyAuth,
  (req: { body: Score }, res: { send: (arg0: Score[]) => void }) => {
    scores = updateScores(req.body);
    res.send(scores);
  }  
);

function updateScores(newScore: Score) {
  const existingScoreIndex = scores.findIndex(score => score.username === newScore.username);
  
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

app.use(function (
  err: { name: any; message: any },
  req: any,
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: { type: any; message: any }): void; new (): any };
    };
  },
  next: any
) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use(
  (
    _req: any,
    res: { sendFile: (arg0: string, arg1: { root: string }) => void }
  ) => {
    res.sendFile("index.html", { root: "public" });
  }
);

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
  res: {
    status?: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: { msg: string }): void; new (): any };
    };
    send?: (arg0: { email: string }) => void;
    cookie?: any;
  },
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
