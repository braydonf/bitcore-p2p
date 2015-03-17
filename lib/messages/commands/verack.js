'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;

module.exports = function(options) {

  var Message = require('../message')(options);

  /**
   * A message in response to a version message.
   * @extends Message
   * @constructor
   */
  function VerackMessage(options) {
    if (!(this instanceof VerackMessage)) {
      return new VerackMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'verack';
  }
  inherits(VerackMessage, Message);

  VerackMessage.fromBuffer = function(payload) {
    return new VerackMessage({});
  };

  VerackMessage.prototype.getPayload = function() {
    return BufferUtil.EMPTY_BUFFER;
  };

  return VerackMessage;
};
