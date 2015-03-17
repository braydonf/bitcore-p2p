'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * Request information about active peers
   * @extends Message
   * @constructor
   */
  function GetaddrMessage(options) {
    if (!(this instanceof GetaddrMessage)) {
      return new GetaddrMessage(options);
    }
    if (!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'getaddr';
  }
  inherits(GetaddrMessage, Message);

  GetaddrMessage.fromBuffer = function() {
    return new GetaddrMessage({});
  };

  GetaddrMessage.prototype.getPayload = function() {
    return BufferUtil.EMPTY_BUFFER;
  };

  return GetaddrMessage;
};
