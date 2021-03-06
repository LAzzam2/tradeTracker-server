'use strict';

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var utilities = require('../utilities/utilities');



// -------------------+
// List Item Schema.  |
// -------------------+

var TradelistItemSchema = new Schema({

	_id: String,
	user: String,
	name: String,
	actions: Array,
	direction: String,
	count: String,
	tradeValue: String
});


var saveWithPromise = function(tradelistItem) {
	var promise = new mongoose.Promise();

	tradelistItem.save(function(error, savedTradelistItem) {
		if(error) {
			promise.reject(error);
		}
		else {
			promise.fulfill(savedTradelistItem);
		}
	});

	return promise;
};




// ---------+
// Methods  |
// ---------+

TradelistItemSchema.statics = {
	blankTradelistItem: function() {
		console.log('tradelistItem.newTradelistItem()');

		var newTradelistItem = new this();

		// Encrypt user ID.
		newTradelistItem._id = utilities.newEncryptedId();

		return newTradelistItem;
	},

	createTradelistItem: function(user, itemName) {
		console.log('User.register();');

		var newTradelistItem = this.blankTradelistItem();

		newTradelistItem.user = user;
		newTradelistItem.name = itemName;
		newTradelistItem.actions = [{ date: '', price: '', quantity: ''}];
		newTradelistItem.direction = '';
		newTradelistItem.count = 0;
		newTradelistItem.tradeValue = '';

		return saveWithPromise(newTradelistItem);
	}
};

TradelistItemSchema.methods = {

};

module.exports = mongoose.model('TradelistItems', TradelistItemSchema);
