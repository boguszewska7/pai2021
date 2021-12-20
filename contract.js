const db = require('./db')
const lib = require('./lib')

const contract = module.exports = {

    handle: function(env) {
       let contractData = {};

        const validate = function(contractData) {
            let result = { 
                contractor: db.ObjectId(contractData.contractor),
                dateB: contractData.dateB, 
                dateE: contractData.dateE,
                salary: contractData.salary}
            return result.contractor ? result : null
        }
       
        if (env.req.method == "POST" || env.req.method == "PUT") {
           contractData = validate(env.payload)
                    if(!contractData) {
                        lib.sendError(env.res, 400, 'invalid payload')
                        return
                    }
            }

        const sendAllContracts = function (q = "") {
            db.contracts
            .aggregate(
                [{
                    $lookup: {
                        from: "contractors",
                        localField: "contractor",
                        foreignField: "_id",
                        as: "contractorData",
                    }
                }, {
                    $unwind: {
                        path: "$contractorData"
                    }
                }]
            )
            .toArray(function (err, contracts) {
              if (!err) {
                lib.sendJson(env.res, contracts);
              } else {
                lib.sendError(env.res, 400, "contracts failed " + err);
              }
            });
          };
        
      
        contractData.when = Date.now()

        

        //contractData.contractorName = GetContractor();
        
        switch(env.req.method) {
        case "GET":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          db.contracts.findOne({ _id }, function (err, result) {
            lib.sendJson(env.res, result);
            console.log( lib.sendJson(env.res, result))
          });} 
        else 
        {
          sendAllContracts(); 
        }
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
       case "PUT":
             _id = db.ObjectId(env.payload._id);
              if (_id) {
              db.contracts.findOneAndUpdate(
              { _id },
              { $set: contractData },
              { returnOriginal: false },
                 function (err, result) {
                    if (!err) 
                { sendAllContracts();} 
                    else {
                          lib.sendError(env.res,400,"persons.findOneAndUpdate() failed");
                        }
                      }
                    );
                  } else {
                    lib.sendError(
                      env.res,
                      400,
                      "broken _id for update " + env.urlParsed.query._id
                    );
                  }
                  break;  
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}