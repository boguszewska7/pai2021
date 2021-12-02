const http = require("http");
const url = require("url");
const nodestatic = require("node-static");

const lib = require("./lib");
const person = require("./person");
const db = require("./db");
const example = require("./example");
const deposit = require("./deposit");
const transaction = require("./transaction");

let server = http.createServer();
let fileServer = new nodestatic.Server("./frontend");

server.on("request", function (req, res) {
  let env = { req, res };
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
  server.listen(7779);
});
