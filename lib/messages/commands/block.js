'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');

module.exports = function(options) {
  var Block = options.Block || bitcore.Block;
  var Message = require('../message')(options);

  /**
   * @param {Object|Block} - options - If is an instance of Block will use as options.block
   * @param {Block} - options.block - An instance of a Block
   * @extends Message
   * @constructor
   */
  function BlockMessage(options) {
    if (!(this instanceof BlockMessage)) {
      return new BlockMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'block';

    var block;
    if (options instanceof Block) {
      block = options;
    } else {
      block = options.block;
    }

    this.block = block;
  }
  inherits(BlockMessage, Message);

  BlockMessage.fromBuffer = function(payload) {
    var block = Block.fromBuffer(payload);
    return new BlockMessage({block: block});
  };

  BlockMessage.prototype.getPayload = function() {
    return this.block.toBuffer();
  };

  return BlockMessage;
};
