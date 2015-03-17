'use strict';

var bitcore = require('bitcore');
var BufferWriter = bitcore.encoding.BufferWriter;
var Hash = bitcore.crypto.Hash;
var magicNumber;

/**
 * Base message that can be inherited to add an additional
 * `getPayload` method to modify the message payload.
 * @param {Object} - options
 * @param {String} - options.command
 * @param {Number} - options.magicNumber
 * @constructor
 */
function Message(options) {
  if(!options) {
    options = {};
  }
  this.command = options.command;
  this.magicNumber = magicNumber;
}

/**
 * @returns {Buffer} - Serialized message
 * @constructor
 */
Message.prototype.toBuffer = Message.prototype.serialize = function() {

  var commandBuf = new Buffer(Array(12));
  commandBuf.write(this.command, 'ascii');

  var payload = this.getPayload();
  var checksum = Hash.sha256sha256(payload).slice(0, 4);

  var bw = new BufferWriter();
  bw.writeUInt32LE(this.magicNumber);
  bw.write(commandBuf);
  bw.writeUInt32LE(payload.length);
  bw.write(checksum);
  bw.write(payload);

  return bw.concat();
};

module.exports = function(options) {
  magicNumber = options.magicNumber || bitcore.Networks.defaultNetwork.networkMagic.readUInt32LE(0);
  return Message;
};
