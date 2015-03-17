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
   * @param {Array} - options.addresses - An array of addrs
   * @extends Message
   * @constructor
   */
  function AddrMessage(options) {
    if (!(this instanceof AddrMessage)) {
      return new AddrMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'addr';
    this.addresses = options.addresses;
  }
  inherits(AddrMessage, Message);

  AddrMessage.fromBuffer = function(payload) {
    var parser = new BufferReader(payload);

    var addrCount = parser.readVarintNum();

    var obj = {};
    obj.addresses = [];
    for (var i = 0; i < addrCount; i++) {
      // todo: time only available on versions >=31402
      var time = new Date(parser.readUInt32LE() * 1000);

      var addr = utils.parseAddr(parser);
      addr.time = time;
      obj.addresses.push(addr);
    }

    utils.checkFinished(parser);
    return new AddrMessage(obj);
  };

  AddrMessage.prototype.getPayload = function() {
    var bw = new BufferWriter();
    bw.writeVarintNum(this.addresses.length);

    for (var i = 0; i < this.addresses.length; i++) {
      var addr = this.addresses[i];
      bw.writeUInt32LE(addr.time.getTime() / 1000);
      utils.writeAddr(addr, bw);
    }

    return bw.concat();
  };

  return AddrMessage;
};
