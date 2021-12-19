const db = require('./db')
const lib = require('./lib')

const contract = module.exports = {

    handle: function(env) {

        const validate = function(contractData) {
            let result = { contractor: db.ObjectId(contractData.contractor), dateB: contractData.dateB, dateE: contractData.dateE }
            return result.contractor ? result : null
        }

        let contractData = validate(env.payload)
        if(!contractData) {
            lib.sendError(env.res, 400, 'invalid payload')
            return
        }

        const sendAllContracts = function (q = "") {
            db.contracts.find({}).toArray(function (err, contracts) {
            console.log("tutaj ok")
              if (!err) {
                lib.sendJson(env.res, contracts);
              } else {
                lib.sendError(env.res, 400, "contracts failed " + err);
              }
            });
          };

        contractData.when = Date.now()
        switch(env.req.method) {
            case "GET":
                    sendAllContracts(q); 
                    break;
            case 'POST':
                db.contracts.insertOne(contractData, function(err, result) {
                    if(!err) {
                        lib.sendJson(env.res, contractData)
                    } else {
                        lib.sendError(env.res, 400, 'transactions.insertOne() failed')
                    }
                })
                break;
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}