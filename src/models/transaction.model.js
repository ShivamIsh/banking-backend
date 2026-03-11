const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required:[true, "transaction must be accociated with a from account"],
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required:[true, "transaction must be accociated with a to account"],
        index: true
    },
    status:{
        type: String,
        enums:{
            values: ["PENDING", "COMPLETE", "FAILED", "REVERSED"],
            message:"Status can only be PENDING, COMEPLETE, FAILED or REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required:[true, "Amount is required for creating a transaction"],
        min:[0, "transcation amount can not be negative"]
    },
    idempotencyKey:{
        type: String,
        required:true,
        index: true,
        unique: true
    }

},{timestamps: true});


const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel