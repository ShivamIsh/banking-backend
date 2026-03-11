const accountModel = require("../models/account.model.js");
const ledgerModel = require("../models/ledger.model.js");
const transactionModel = require("../models/transaction.model.js");
const mongoose = require("mongoose");

async function createTransaction(req,res){
    const {fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"something is missing from the transaction detail in the request body"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    });

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    });

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"invalid fromAccount or toAccount"
        });
    }

    // validate idempotency key
    const istransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });

    if(istransactionAlreadyExist){
        if(istransactionAlreadyExist.status == "COMPLETED"){
            return res.status(200).json({
                message: "transaction Already completed",
                transaction: istransactionAlreadyExist
            });
        }
        if(istransactionAlreadyExist.status == "PENDING"){
            return res.status(200).json({
                message: "transaction is being processed"
            });
        }
        if(istransactionAlreadyExist.status == "FAILED"){
            return res.status(500).json({
                message: "transaction processing failed"
            });
        }
        if(istransactionAlreadyExist.status == "REVERSED"){
            return res.status(200).json({
                message: "transaction was reversed"
            });
        }
    }


    // check account status
        if(fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE"){
            return res.status(400).json({
                message: "both to and from account must be active"
            })
        }

        // derive sender balance from ledger
        const balance = await fromUserAccount.getBalance();

        if(balance < amount){
            return res.status(400).json({
                message: "insufficient balance"
            })
        };

        let transaction;
        try {
            // create transaction -------PENDING
        const session = await mongoose.startSession();

        session.startTransaction();

        transaction = (await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }, {session}))[0];

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], {session});

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], {session});


        await transactionModel.findOneAndUpdate(
            {_id:transaction._id},
            {status: "COMPLETED"},
            {session}
        )


        await session.commitTransaction();
        session.endSession();


        // send email logic ... i am not writing it here now becaue the controleer is having some issue
            
        } catch (error) {

            return res.status(400).json({
                message: "Transaction pending due to internal error",
                error: error.message
            })
            
        }


        return res.status(201).json({
            message:" tranaction completed successfully",
            transaction: transaction
        })

        







}


async function createInitialFundsTransaction(req, res){
    const {toAccount, amount, idempotencyKey} = req.body;
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "all the information are not in the request body"
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    });

    if(!toUserAccount){
        return res.status(400).json({
            message: "invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

     if(!fromUserAccount){
        return res.status(400).json({
            message: "systemUser account not found"
        })
    }


    const session = await mongoose.startSession();

    session.startTransaction();

    const transaction =  new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], {session});

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], {session});


        transaction.status = "COMPLETED";
        await transaction.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message:"initial funds transaction completed"
        });






}


module.exports = {
    createTransaction,
    createInitialFundsTransaction
}