"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var MongoClient = require('mongodb').MongoClient;
var config = require('./dbConfig.json');
var url = "mongodb+srv://".concat(config.username, ":").concat(config.password, "@").concat(config.hostname);
var client = new MongoClient(url);
var db = client.db('startup');
var userCollection = db.collection('user');
var scoreCollection = db.collection('score');
var transactionCollection = db.collection('transaction');
var app = express();
var authCookieName = "token";
(function testConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.command({ ping: 1 })];
                case 2:
                    _a.sent();
                    console.log("Connected to database");
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    console.log("Unable to connect to database with ".concat(url, " because ").concat(ex_1.message));
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
})();
function findUser(key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(key === "email")) return [3 /*break*/, 2];
                    return [4 /*yield*/, userCollection.findOne({ email: value })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, userCollection.findOne({ token: value })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
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
                    return [4 /*yield*/, userCollection.insertOne(user)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
function updateUserToken(email, token) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, userCollection.updateOne({ email: email }, { $set: { token: token } })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, userCollection.updateOne({ email: email }, { $unset: { token: "" } })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getHighScores() {
    return __awaiter(this, void 0, void 0, function () {
        var query, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = { score: { $gt: 0, $lt: 900 } };
                    options = {
                        sort: { score: -1 },
                        limit: 10,
                    };
                    return [4 /*yield*/, scoreCollection.find(query, options).toArray()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function updateScores(newScore) {
    return __awaiter(this, void 0, void 0, function () {
        var existingScore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scoreCollection.findOne({ userName: newScore.userName })];
                case 1:
                    existingScore = _a.sent();
                    if (!existingScore) return [3 /*break*/, 3];
                    return [4 /*yield*/, scoreCollection.updateOne({ userName: newScore.userName }, { $set: { score: existingScore.score + newScore.score } })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, scoreCollection.insertOne(newScore)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, getHighScores()];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function addTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var processedTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processedTransaction = __assign(__assign({}, transaction), { date: new Date(transaction.date) });
                    return [4 /*yield*/, transactionCollection.insertOne(processedTransaction)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getTransactions(userToken) {
    return __awaiter(this, void 0, void 0, function () {
        var query, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = { userToken: userToken };
                    return [4 /*yield*/, transactionCollection.find(query).toArray()];
                case 1:
                    transactions = _a.sent();
                    console.log("Found ".concat(transactions.length, " transactions for token ").concat(userToken));
                    return [2 /*return*/, transactions];
            }
        });
    });
}
var port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
var apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.post("/auth/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, findUser("email", req.body.email)];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) return [3 /*break*/, 2];
                res.status(409).send({ msg: "Existing user" });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, createUser(req.body.email, req.body.password)];
            case 3:
                user = _a.sent();
                setAuthCookie(res, user.token);
                res.send({ email: user.email });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error("Error creating user:", error_1);
                res.status(500).send({ msg: "Error creating user" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
apiRouter.post("/auth/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, findUser("email", req.body.email)];
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
                token = uuid.v4();
                return [4 /*yield*/, updateUserToken(user.email, token)];
            case 4:
                _b.sent();
                setAuthCookie(res, token);
                res.send({ email: user.email });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Error during login:", error_2);
                res.status(500).send({ msg: "Error during login" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
apiRouter.delete("/auth/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, findUser("token", req.cookies[authCookieName])];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, updateUserToken(user.email, null)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.clearCookie(authCookieName);
                res.status(204).end();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error("Error during logout:", error_3);
                res.status(500).send({ msg: "Error during logout" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
var verifyAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.cookies[authCookieName];
                if (!token) {
                    res.status(401).send({ msg: "No authentication token" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, findUser("token", token)];
            case 1:
                user = _a.sent();
                if (user) {
                    req.body.userToken = token;
                    next();
                }
                else {
                    res.status(401).send({ msg: "Unauthorized - Invalid token" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error verifying authentication:", error_4);
                res.status(500).send({ msg: "Error verifying authentication" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
apiRouter.get("/scores", verifyAuth, function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scores, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getHighScores()];
            case 1:
                scores = _a.sent();
                res.send(scores);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error retrieving scores:", error_5);
                res.status(500).send({ msg: "Error retrieving scores" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
apiRouter.post("/score", verifyAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scores, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, updateScores(req.body)];
            case 1:
                scores = _a.sent();
                res.send(scores);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error updating score:", error_6);
                res.status(500).send({ msg: "Error updating score" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
apiRouter.get("/transactions", verifyAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userToken, transactions, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userToken = req.cookies[authCookieName];
                console.log("Fetching transactions for token:", userToken);
                return [4 /*yield*/, getTransactions(userToken)];
            case 1:
                transactions = _a.sent();
                res.send(transactions);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error retrieving transactions:", error_7);
                res.status(500).send({ msg: "Error retrieving transactions" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
apiRouter.post("/transaction", verifyAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userToken, transaction, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userToken = req.cookies[authCookieName];
                console.log("Adding transaction for user token:", userToken);
                transaction = __assign(__assign({}, req.body), { userToken: userToken });
                console.log("Transaction to add:", transaction);
                return [4 /*yield*/, addTransaction(transaction)];
            case 1:
                _a.sent();
                res.send({ msg: "Transaction added successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error("Error adding transaction:", error_8);
                res.status(500).send({ msg: "Error adding transaction" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use(function (err, req, res, next) {
    console.error("Application error:", err);
    res.status(500).send({
        type: err.name,
        message: err.message
    });
});
app.use(function (_req, res) {
    res.sendFile("index.html", { root: "public" });
});
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
