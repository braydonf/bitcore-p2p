'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;


module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * Request peer to clear data for a bloom filter
   * @extends Message
   * @constructor
   */
  function FilterclearMessage(options) {
    if (!(this instanceof FilterclearMessage)) {
      return new FilterclearMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'filterclear';
  }
  inherits(FilterclearMessage, Message);

  FilterclearMessage.fromBuffer = function(payload) {
    return new FilterclearMessage({});
  };

  FilterclearMessage.prototype.getPayload = function() {
    return BufferUtil.EMPTY_BUFFER;
  };

  return FilterclearMessage;
};
