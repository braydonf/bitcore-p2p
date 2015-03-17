'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;

module.exports = function(options) {
  var Message = require('../message')(options);

  // todo: add payload: https://en.bitcoin.it/wiki/Protocol_documentation#reject
  function RejectMessage(options) {
    if (!(this instanceof RejectMessage)) {
      return new RejectMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'reject';
  }
  inherits(RejectMessage, Message);

  RejectMessage.fromBuffer = function(payload) {
    var obj = {};
    return new RejectMessage(obj);
  };

  RejectMessage.prototype.getPayload = function() {
    return BufferUtil.EMPTY_BUFFER;
  };

  return RejectMessage;
};
