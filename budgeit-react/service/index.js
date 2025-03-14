"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var uuid = require('uuid');
// Create Express app with proper type
var app = express();
var authCookieName = "token";
var users = [];
var scores = [];
var port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
var apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.post("/auth/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, findUser("email", req.body.email)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 2];
                res.status(409).send({ msg: "Existing user" });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, createUser(req.body.email, req.body.password)];
            case 3:
                user = _a.sent();
                setAuthCookie(res, user.token);
                res.send({ email: user.email });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
function findUser(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, users.find(function (user) { return user[key] === value; }) || null];
        });
    });
}
apiRouter.post("/auth/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, findUser("email", req.body.email)];
            case 1:
                user = _b.sent();
                _a = !user;
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.compare(req.body.password, user.password)];
            case 2:
                _a = !(_b.sent());
                _b.label = 3;
            case 3:
                if (_a) {
                    res.status(401).send({ msg: "Unauthorized" });
                    return [2 /*return*/];
                }
                user.token = uuid.v4();
                setAuthCookie(res, user.token);
                res.send({ email: user.email });
                return [2 /*return*/];
        }
    });
}); });
apiRouter.delete("/auth/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, findUser("token", req.cookies[authCookieName])];
            case 1:
                user = _a.sent();
                if (user) {
                    delete user.token;
                }
                res.clearCookie(authCookieName);
                res.status(204).end();
                return [2 /*return*/];
        }
    });
}); });
var verifyAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, findUser("token", req.cookies[authCookieName])];
            case 1:
                user = _a.sent();
                if (user) {
                    next();
                }
                else {
                    res.status(401).send({ msg: "Unauthorized" });
                }
                return [2 /*return*/];
        }
    });
}); };
apiRouter.get("/scores", verifyAuth, function (_req, res) {
    res.send(scores);
});
apiRouter.post("/score", verifyAuth, function (req, res) {
    scores = updateScores(req.body);
    res.send(scores);
});
function updateScores(newScore) {
    var existingScoreIndex = scores.findIndex(function (score) { return score.userName === newScore.userName; });
    if (existingScoreIndex !== -1) {
        scores[existingScoreIndex].score += newScore.score;
        scores.sort(function (a, b) { return b.score - a.score; });
    }
    else {
        var inserted = false;
        for (var i = 0; i < scores.length; i++) {
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
app.use(function (err, req, res, next) {
    res.status(500).send({
        type: err.name,
        message: err.message
    });
});
app.use(function (_req, res) {
    res.sendFile("index.html", { root: "public" });
});
function createUser(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var passwordHash, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 1:
                    passwordHash = _a.sent();
                    user = {
                        email: email,
                        password: passwordHash,
                        token: uuid.v4(),
                    };
                    users.push(user);
                    return [2 /*return*/, user];
            }
        });
    });
}
function setAuthCookie(res, authToken) {
    if (authToken) {
        res.cookie(authCookieName, authToken, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });
    }
}
app.listen(port, function () {
    console.log("Listening on port ".concat(port));
});
