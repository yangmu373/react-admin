/**
 * RecommendStore
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var RecommendConstants = require('../constants/RecommendConstants');

var CHANGE_EVENT = 'change';
var ERR_EVENT = 'err';

var _data = [];
var _err = {};
var _one = {};

function all(data) {
  _data = data;
}

function err(err) {
  _err = err;
}

function add(data) {
  _data.unshift(data);
}

function edit(data) {
  for (var key in _data) {
    if (_data[key].id == data.id) {
      _data[key] = data;
    }
  }
}

function one(id) {
  for (var key in _data) {
    if (_data[key].id == id) {
      _one = _data[key];
    }
  }
}

function del(data) {
  var newData = _data.filter(function(row){
    return row.id != data.id;
  });
  _data = newData;
}

var RecommendStore = assign({}, EventEmitter.prototype, {

  all: function() {
    return _data;
  },

  one: function(id) {
    one(id);
    return _one;
  },

  err: function() {
    return _err;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitErr: function() {
    this.emit(ERR_EVENT);
  },

  addErrListener: function(callback) {
    this.on(ERR_EVENT, callback);
  },

  removeErrListener: function(callback) {
    this.removeListener(ERR_EVENT, callback);
  }

});

AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case RecommendConstants.RCMD_ALL:
      all(action.data);
      RecommendStore.emitChange();
      break;

    case RecommendConstants.RCMD_ADD:
      var errData = {};
      if (action.err) {
        errData = action.err;
      } else {
        add(action.data);
        RecommendStore.emitChange();
      }
      err(errData);
      RecommendStore.emitErr();
      break;

    case RecommendConstants.RCMD_EDT:
      var errData = {};
      if (action.err) {
        errData = action.err;
      } else {
        edit(action.data);
        RecommendStore.emitChange();
      }
      err(errData);
      RecommendStore.emitErr();
      break;

    case RecommendConstants.RCMD_DEL:
      del(action.data);
      RecommendStore.emitChange();
      break;

    default:
  }

});

module.exports = RecommendStore;
