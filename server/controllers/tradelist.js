'use strict';

var mongoose  = require('mongoose');
var User      = mongoose.model('User');
var TradelistItems = mongoose.model('TradelistItems');
var Promise   = require('bluebird');

Promise.promisifyAll(mongoose);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

var config    = require('../config/config.js');
var validator = require('validator');

var createNewTradelistItem = function(userId, tradelistItem)
{
	return new Promise( function(resolve, reject)
	{
		TradelistItems.createTradelistItem(userId, tradelistItem)
		.then( function(newTradelistItem) {
			User.findByIdAndUpdate({
				'_id': userId
			},
			{
				$push: {
					'tradelist': newTradelistItem._id
				}
			},
			function(error, user)
			{
				if(error) {
					console.log(error);
					reject(error);
				}
				else {
					if(user) {
						resolve({ 'newTradelistItem': newTradelistItem });
					}
					else {
						console.log(error);
						reject({ 'message': 'No user found.' });
					}
				}
			});
		});
	});
};

var updateTradelistItem = function(tradelistItemId, tradelistItemValue, tradelistItemActions, tradeValue, direction) {

	return new Promise( function(resolve, reject) {
		TradelistItems.findOneAndUpdate({
			_id: tradelistItemId
		},
		{
			$set: {
				name: tradelistItemValue,
				actions: tradelistItemActions,
				direction: direction,
				tradeValue: tradeValue
			}
		},
		{
			new: true
		},
		function(error, tradelistItem) {
			if(error) {
				console.log(error);
				reject(error);
			}
			else {
				console.log(tradelistItem);
				if(tradelistItem){
					resolve({ 'updatedTradelistItem': tradelistItem });
				}
				else {
					reject({ 'message': 'No tradelistItem found.' });
				}
			}
		});
	});
};

exports.upsertTradelistItem = function(userId, tradelistItem, tradelistItemValue, tradelistItemId, tradelistItemActions, tradelistItemTradeValue, tradelistItemDirection) {
	console.log( 'routes 2: ', tradelistItemActions )
	return new Promise(function( resolve, reject) {
		if(tradelistItemId) {
			// Update an existing list item.
			updateTradelistItem(tradelistItemId, tradelistItemValue, tradelistItemActions, tradelistItemTradeValue, tradelistItemDirection)
			.then( function(updatedTradelistItem) {
				resolve(updatedTradelistItem);
			})
			.catch(function(error) {
				reject(error);
			});
		}
		else {
			// Create a new list item.
			createNewTradelistItem(userId, tradelistItemValue)
			.then(function(newTradelistItem) {
				resolve(newTradelistItem);
			})
			.catch(function(error) {
				reject(error);
			});
		}
	});
};

exports.deleteTradelistItem = function(req, res, next) {
	var tradelistItem      = req.body.tradelistItem;
	var tradelistItemValue = tradelistItem.name;
	var tradelistItemId    = tradelistItem._id;

	return new Promise(function(resolve, reject) {
		TradelistItems.findOneAndRemove({
			'_id': tradelistItemId
		},
		function(error) {
			if(error) {
				console.log(error);
				reject(error);
			}
			else {
				resolve();
			}
		});
	});
};

exports.getTradelist = function(userId) {
	return new Promise(function(resolve, reject) {
		TradelistItems.find({
			user: userId
		},
		function(error, tradelistItems) {
			if(error) {
				console.log(error);
				reject(error);
			}

			resolve(tradelistItems);
		});
	});
};
