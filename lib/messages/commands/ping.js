'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var utils = require('../utils');
var BufferReader = bitcore.encoding.BufferReader;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * A message to confirm that a connection is still valid.
   * @param {Object} options
   * @param {Buffer} options.nonce
   * @extends Message
   * @constructor
   */
  function PingMessage(options) {
    if (!(this instanceof PingMessage)) {
      return new PingMessage(options);
    }
    if (!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'ping';
    this.nonce = options.nonce || utils.getNonce();
  }
  inherits(PingMessage, Message);

  PingMessage.prototype.getPayload = function() {
    return this.nonce;
  };

  PingMessage.fromBuffer = function(payload) {
    var obj = {};
    var parser = new BufferReader(payload);
    obj.nonce = parser.read(8);

    utils.checkFinished(parser);
    return new PingMessage(obj);
  };

  return PingMessage;
};
