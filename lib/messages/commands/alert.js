'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var utils = require('../utils');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * @param {Object} - options
   * @param {Buffer} - options.payload
   * @param {Buffer} - options.signature
   * @extends Message
   * @constructor
   */
  function AlertMessage(options) {
    if (!(this instanceof AlertMessage)) {
      return new AlertMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'alert';

    this.payload = options.payload || new Buffer(32);
    this.signature = options.signature || new Buffer(32);
  }
  inherits(AlertMessage, Message);

  AlertMessage.fromBuffer = function(payload) {
    var obj = {};
    var parser = new BufferReader(payload);
    obj.payload = parser.readVarLengthBuffer();
    obj.signature = parser.readVarLengthBuffer();
    utils.checkFinished(parser);
    return new AlertMessage(obj);
  };

  AlertMessage.prototype.getPayload = function() {
    var bw = new BufferWriter();
    bw.writeVarintNum(this.payload.length);
    bw.write(this.payload);

    bw.writeVarintNum(this.signature.length);
    bw.write(this.signature);

    return bw.concat();
  };

  return AlertMessage;
};
