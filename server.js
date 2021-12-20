const http = require("http");
const url = require("url");
const nodestatic = require("node-static");
const uuid = require("uuid");
const cookies = require("cookies");

const lib = require("./lib");
const person = require("./person");
const db = require("./db");
const example = require("./example");
const deposit = require("./deposit");
const transaction = require("./transaction");
const contractor = require("./contractor");
const contract = require("./contract");

let server = http.createServer();
let fileServer = new nodestatic.Server("./frontend");

server.on("request", function (req, res) {
  let env = { req, res };
  let appCookies = new cookies(req, res);
  let session = appCookies.get("session");
  let now = Date.now();
  if (!session || !lib.sessions[session]) {
    session = uuid.v4();
    lib.sessions[session] = {
      from: req.connection.remoteAddress,
      created: now,
      touched: now,
    };
  } else {
    lib.sessions[session].from = req.connection.remoteAddress;
    lib.sessions[session].touched = now;
  }
  appCookies.set("session", session, { httpOnly: false });
  env.session = session;

  env.urlParsed = url.parse(req.url, true);
  if (!env.urlParsed.query) env.urlParsed.query = {};
  env.payload = "";
  req
    .on("data", function (data) {
      env.payload += data;
    })
    .on("end", function () {
      try {
        env.payload = env.payload ? JSON.parse(env.payload) : {};
      } catch (ex) {
        console.error(
          req.method,
          env.urlParsed.pathname,
          JSON.stringify(env.urlParsed.query),
          "ERROR PARSING:",
          env.payload
        );
        lib.sendError(res, 400, "parsing payload failed");
        return;
      }
      console.log(
        session,
        req.method,
        env.urlParsed.pathname,
        JSON.stringify(env.urlParsed.query),
        JSON.stringify(env.payload)
      );
      switch (env.urlParsed.pathname) {
        case "/person":
          person.handle(env);
          break;
        case "/deposit":
          deposit.handle(env);
          break;
        case "/contractor":
            contractor.handle(env);
            break;
        case "/contract":
            contract.handle(env);
            break;
        case "/transaction":
          transaction.handle(env);
          break;
        default:
          fileServer.serve(req, res);
      }
    });
});

db.init(function () {
  // for development only
  example.initializePersons();
  //
  server.listen(7763
    );
});
