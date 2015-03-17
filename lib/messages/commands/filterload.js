'use strict';

var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;
var BloomFilter = require('../../bloomfilter');
var $ = bitcore.util.preconditions;
var _ = bitcore.deps._;

module.exports = function(options) {
  var Message = require('../message')(options);

  /**
   * Request peer to send inv messages based on a bloom filter
   * @param {BloomFilter} options.filter - An instance of BloomFilter
   * @extends Message
   * @constructor
   */
  function FilterloadMessage(options) {
    if (!(this instanceof FilterloadMessage)) {
      return new FilterloadMessage(options);
    }
    if(!options) {
      options = {};
    }
    Message.call(this, options);
    this.command = 'filterload';
    $.checkArgument(_.isUndefined(options.filter) || options.filter instanceof BloomFilter,
                    'BloomFilter object  or undefined required for FilterLoad');
    this.filter = options.filter;
  }
  inherits(FilterloadMessage, Message);

  FilterloadMessage.fromBuffer = function(payload) {
    var obj = {};
    obj.filter = BloomFilter.fromBuffer(payload);
    return new FilterloadMessage(obj);
  };

  FilterloadMessage.prototype.getPayload = function() {
    if(this.filter) {
      return this.filter.toBuffer();
    } else {
      return BufferUtil.EMPTY_BUFFER;
    }
  };

  return FilterloadMessage;
};
