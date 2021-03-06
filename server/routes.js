'use strict';

var user     = require('./controllers/user');
var list     = require('./controllers/list');
var tradelist     = require('./controllers/tradelist');
var authentication  = require( './controllers/authentication');
var Promise  = require('bluebird');



// --------------------+
// Application routes  |
// --------------------+

module.exports = function(app) {
	var apiPending = function(req, res)
	{
		res.send( { msg: 'Not implemented yet.' }, 501);
	};

	var authRequired = function(req, res, next) {
		console.log( 'Authorization is required. Are you authenticated?');

		if(req.isAuthenticated()) {
			console.log('Yes! You are authenticated.');
			return next();
		}

		console.log('No, you are not authenticated.');

		res.status(401).send({ msg: 'Unauthorized.' });
	};



	// ------------------+
	// Session handlers. |
	// ------------------+

	app.post('/api/user/session', function(req, res, next) {
		authentication.loginUser(req)
		.then(function() {
			res.json(req.user.userInfo);
		} )
		.catch( function(error) {
			res.status(401).json(error);
		});
	});

	app.delete( '/api/user/session', function(req, res) {
		req.logout();
		res.status(204).send({ });
	});



	// --------------+
	// Registration. |
	// --------------+

	app.post('/api/user/register', function(req, res, next) {
		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.password;

		user.register(name, email, password)
		.then(function() {
			next();
		})
		.catch( function(error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		});
	},
	function(req, res, next) {
		authentication.loginUser(req)
		.then(function() {
			res.json(req.user.userInfo);
		})
		.catch( function(error) {
			res.status(401).json(error);
		});
	});



	// --------------+
	// User account. |
	// --------------+

	app.post('/api/user/info', authRequired, function(req, res) {
		user.updateUserInfo(req, res)
		.then( function(userInfo) {
			console.log(userInfo);
			res.status(200).send(userInfo);
		})
		.catch(function(error) {
			res.status(500).send(error);
		});
	});



	// -----------------+
	// List operations. |
	// -----------------+

	app.post('/api/user/list', authRequired, function(req, res, next) {
		// From client:
		var userId        = req.user._id;
		var listItem      = req.body.listItem;
		var listItemValue = listItem.name;
		var listItemId    = listItem._id;

		list.upsertListItem(userId, listItem, listItemValue, listItemId)
		.then( function(updatedListItem) {
			res.status(200).send(updatedListItem);
		} )
		.catch( function(error) {
			res.status(500).send({ 'message': error.message });
		} );
	} );

	app.put('/api/user/list', authRequired, function(req, res)
	{
		list.deleteListItem(req, res)
		.then(function() {
			res.status(200).send({ 'message': 'Successfully deleted list item.' });
		} )
		.catch( function(error){
			res.status(500).send({ 'message': 'Failed to send list item.' });
		});
	});

	app.get('/api/user/list', authRequired, function(req, res, next) {
		var userId = req.user._id;

		list.getList(userId)
		.then( function(listItems) {
			res.status(200).send({ 'listItems': listItems });
		})
		.catch( function(error) {
			res.status(500).send({ 'message': error });
		});
	});

	// -----------------+
	// Tradelist operations. |
	// -----------------+

	app.post('/api/user/tradelist', authRequired, function(req, res, next) {
		// From client:
		var userId        = req.user._id;
		var tradelistItem      = req.body.tradelistItem;
		var tradelistItemValue = tradelistItem.name;
		var tradelistItemId    = tradelistItem._id;
		var tradelistItemActions = tradelistItem.actions;
		var tradelistItemDirection = tradelistItem.direction;
		var tradelistItemCount = tradelistItem.count;
		var tradelistItemTradeValue = tradelistItem.tradeValue;
		console.log('server req: ',tradelistItemActions)

		tradelist.upsertTradelistItem(userId, tradelistItem, tradelistItemValue, tradelistItemId, tradelistItemActions, tradelistItemDirection, tradelistItemCount, tradelistItemTradeValue)
		.then( function(updatedTradelistItem) {
			res.status(200).send(updatedTradelistItem);
		} )
		.catch( function(error) {
			res.status(500).send({ 'message': error.message });
		} );
	} );

	app.put('/api/user/tradelist', authRequired, function(req, res)
	{
		tradelist.deleteTradelistItem(req, res)
		.then(function() {
			res.status(200).send({ 'message': 'Successfully deleted tradelist item.' });
		} )
		.catch( function(error){
			res.status(500).send({ 'message': 'Failed to send tradelist item.' });
		});
	});

	app.get('/api/user/tradelist', authRequired, function(req, res, next) {
		var userId = req.user._id;

		tradelist.getTradelist(userId)
		.then( function(tradelistItems) {
			res.status(200).send({ 'tradelistItems': tradelistItems });
		})
		.catch( function(error) {
			res.status(500).send({ 'message': error });
		});
	});

	app.get('/api/community/tradelist', authRequired, function(req, res, next) {
		var userId = req.user._id;

		tradelist.getCommunityTradelist(userId)
		.then( function(tradelistItems) {
			res.status(200).send({ 'tradelistItems': tradelistItems });
		})
		.catch( function(error) {
			res.status(500).send({ 'message': error });
		});
	});

	console.log('Routes successfully loaded.');
};
