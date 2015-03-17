'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var utils = require('../utils');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var Inventory = require('../../inventory');
var _ = bitcore.deps._;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * @param {Object|Array} - options - If options is an array will use as "inventory"
   * @param {Array} options.inventory - An array of inventory items
   * @extends Message
   * @constructor
   */
  function InvMessage(options) {
    if (!(this instanceof InvMessage)) {
      return new InvMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'inv';

    var inventory;
    if (_.isArray(options)) {
      inventory = options;
    } else {
      inventory = options.inventory;
    }
    utils.checkInventory(inventory);
    this.inventory = inventory;
  }
  inherits(InvMessage, Message);

  /**
   * @param {Buffer|String} hash - The hash of the transaction inventory item
   * @returns {InvMessage}
   */
  InvMessage.forTransaction = function(hash) {
    return new InvMessage([Inventory.forTransaction(hash)]);
  };

  /**
   * @param {Buffer|String} hash - The hash of the block inventory item
   * @returns {InvMessage}
   */
  InvMessage.forBlock = function(hash) {
    return new InvMessage([Inventory.forBlock(hash)]);
  };

  /**
   * @param {Buffer|String} hash - The hash of the filtered block inventory item
   * @returns {InvMessage}
   */
  InvMessage.forFilteredBlock = function(hash) {
    return new InvMessage([Inventory.forFilteredBlock(hash)]);
  };

  InvMessage.prototype.getPayload = function() {
    var bw = new BufferWriter();
    utils.writeInventory(this.inventory, bw);
    return bw.concat();
  };

  InvMessage.fromBuffer = function(payload) {
    var obj = {
      inventory: []
    };

    var parser = new BufferReader(payload);
    var count = parser.readVarintNum();
    for (var i = 0; i < count; i++) {
      var type = parser.readUInt32LE();
      var hash = parser.read(32);
      obj.inventory.push({type: type, hash: hash});
    }

    utils.checkFinished(parser);
    return new InvMessage(obj);
  };

  return InvMessage;
};
