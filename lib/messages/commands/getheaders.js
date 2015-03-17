'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var utils = require('../utils');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var $ = bitcore.util.preconditions;

module.exports = function(options) {
  var Message = require('../message')(options);
  var protocolVersion = options.protocolVersion || 70000;

  /**
   * Query another peer about block headers. It can query for multiple block hashes,
   * and the response will contain all the chains of blocks starting from those
   * hashes.
   * @param {Object} options
   * @param {Array} options.starts - Array of buffers or strings with the starting block hashes
   * @param {Buffer} options.stop - Hash of the last block
   */
  function GetheadersMessage(options) {
    if (!(this instanceof GetheadersMessage)) {
      return new GetheadersMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'getheaders';
    this.version = protocolVersion;

    options = utils.sanitizeStartStop(options);
    this.starts = options.starts;
    this.stop = options.stop;
  }
  inherits(GetheadersMessage, Message);


  GetheadersMessage.fromBuffer = function(payload) {
    var obj = {};
    var parser = new BufferReader(payload);
    $.checkArgument(!parser.finished(), 'No data received in payload');

    obj.version = parser.readUInt32LE();
    var startCount = Math.min(parser.readVarintNum(), 500);

    obj.starts = [];
    for (var i = 0; i < startCount; i++) {
      obj.starts.push(parser.read(32));
    }
    obj.stop = parser.read(32);
    utils.checkFinished(parser);
    return new GetheadersMessage(obj);
  };

  GetheadersMessage.prototype.getPayload = function() {
    var bw = new BufferWriter();
    bw.writeUInt32LE(this.version);
    bw.writeVarintNum(this.starts.length);
    for (var i = 0; i < this.starts.length; i++) {
      bw.write(this.starts[i]);
    }
    if (this.stop.length !== 32) {
      throw new Error('Invalid hash length: ' + this.stop.length);
    }
    bw.write(this.stop);
    return bw.concat();
  };

  return GetheadersMessage;
};
