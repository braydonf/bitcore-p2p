'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');

module.exports = function(options) {
  var Message = require('../message')(options);
  var Transaction = options.Transaction || bitcore.Transaction;

  /**
   * @param {Object|Transaction} - options - If is an instance of Transaction will use as options.transaction
   * @param {Transaction} - options.transaction - An instance of a Transaction
   * @extends Message
   * @constructor
   */
  function TransactionMessage(options) {
    if (!(this instanceof TransactionMessage)) {
      return new TransactionMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'tx';

    var transaction;
    if(options instanceof Transaction) {
      transaction = options;
    } else {
      transaction = options.transaction;
    }

    this.transaction = transaction;
}
  inherits(TransactionMessage, Message);

  TransactionMessage.fromBuffer = function(payload) {
    var transaction;
    if (Transaction.prototype.fromBuffer) {
      transaction = new Transaction().fromBuffer(payload);
    } else {
      transaction = Transaction.fromBuffer(payload);
    }
    return new TransactionMessage({transaction: transaction});
  };

  TransactionMessage.prototype.getPayload = function() {
    return this.transaction.toBuffer();
  };


  return TransactionMessage;
};
