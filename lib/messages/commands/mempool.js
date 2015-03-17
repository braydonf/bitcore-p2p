'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * The mempool message sends a request to a node asking for information about
   * transactions it has verified but which have not yet confirmed.
   * @see https://en.bitcoin.it/wiki/Protocol_documentation#mempool
   * @extends Message
   * @constructor
   */
  function MempoolMessage(options) {
    if (!(this instanceof MempoolMessage)) {
      return new MempoolMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'mempool';
  }
  inherits(MempoolMessage, Message);

  MempoolMessage.fromBuffer = function(payload) {
    return new MempoolMessage({});
  };

  MempoolMessage.prototype.getPayload = function() {
    return BufferUtil.EMPTY_BUFFER;
  };

  return MempoolMessage;
};
