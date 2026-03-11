const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true,
        immutable: true
    },
     transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum:{
            values:["CREDIT", "DEBIT"],
            message: "type can be either CREDIT or DEBIT"
        },
        required: true,
        immutable: true

    }

    
})


function preventLedgerModification(){
    throw new Error("ledger modification is prohibited")
}


ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMant", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);



const ledgerModel = mongoose.model("Ledger", ledgerSchema);

module.exports = ledgerModel