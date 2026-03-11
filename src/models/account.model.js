const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model.js");

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true, "Account must be associated with the user"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message:"State can either be active, frozen or close"
        },
        default: "ACTIVE"

    },
    currency:{
        type:String,
        required: true,
        default: "INR"
    },

},{timestamps: true})

accountSchema.index({user:1, status:1});


accountSchema.methods.getBalance = async function () {
    const result = await mongoose.model("Ledger").aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: "$account",
                balance: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            { $multiply: ["$amount", -1] }
                        ]
                    }
                }
            }
        }
    ])

    return result.length ? result[0].balance : 0
    
}


const accountModel = mongoose.model("Account", accountSchema);


module.exports = accountModel