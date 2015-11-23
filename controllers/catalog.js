var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var KO = require('../models/KO');
var secrets = require('../config/secrets');
var mongoose = require('mongoose');


// res.sendStatus(200); // equivalent to res.status(200).send('OK')
// res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
// res.status(403).send('Sorry! you cant see that.');


/**
 * GET /signin
 * Sign In page.
 */

exports.createKO = function(req,res){
	ko = req.body;
	console.log(kos);

	KO.create(ko, function(err,ko){
		if (err) console.log(err)
		res.status(200).json(ko);
	});
}

exports.getKO = function(req,res){
	ko_id = req.params.ko_id;

	query = {"_id":ko_id};
	KO.findOne(query).exec.
	then(function(ko){
		res.json(ko)
	});	
}


exports.getCatalogs = function(req,res){
	res.send(true)
}

exports.createCatalogs = function(req, res){
	catalogs = req.body;
	console.log(catalogs);

	Catalog.create(catalogs, function(err,catalogs){
		if (err) console.log(err)
		res.send({'success':true})
	});
}

exports.checkCatalogPermission = function(req,res){
	catalog_id = mongoose.Types.ObjectId(req.params.catalog_id);
	user = req.params.user;
	permission_type = req.params.permission_type;

	permission_query = {
		"_id": catalog_id,
		"permission":{
						"$elemMatch":{
							"user":user,
							"permission":permission_type
						}
					}
	}

	Catalog.findOne(permission_query).exec().
	then(function(catalog){
		res.json(catalog)
	})	
}

exports.insertTestCatalogs = function(req,res){
	test_catalogs = []
	catalog_template = {
	"owner":"blaiszik",
	"name": "Ben's Catalog",
	"permission":[{"user":"blaiszik","permission":"r"}, {"user":"blaiszik","permission":"w"}],
	"tag":[{"key":"a","value":2}, {"key":"b","value":3}],
	"dataset": [{
			  "name":"DS1",
			  "uri": ["globus://go#ep1/file1.txt","globus://go#ep1/file2.txt"],
			  "tag":[{"key":"a","value":3}, {"key":"b","value":4}],
			  "data": ["a",1,2,3,"true"]
			},{
			  "name":"DS2",
			  "uri": ["globus://go#ep1/file2.txt","globus://go#ep1/file3.txt"],
			  "tag":[{"key":"a","value":5}, {"key":"b","value":6}],
			  "data": ["a",1,2,3,"true"]
			}],
	"uri":["globus://go#ep1/file1.txt","globus://go#ep1/file2.txt"]
	}

	num_catalogs = 1000
	for(i=0; i<num_catalogs; i++){
		test_catalogs.push(catalog_template)
		if (!(i%100)) {
			console.log("Test data insert "+i);
			cur_time = new Date().toISOString()
			console.log(cur_time)
		}
	}

	Catalog.create(test_catalogs,function(err,catalogs){
		if (err) console.log(err)
		cur_time = new Date().toISOString()
		console.log(cur_time)
		res.send({'success':true})
	});

}


