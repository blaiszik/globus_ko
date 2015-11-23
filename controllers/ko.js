var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var KO = require('../models/KO');
var secrets = require('../config/secrets');
var mongoose = require('mongoose');

// *  GET /boat -> BoatController.find                                        *
// *  GET /boat/:id -> BoatController.findOne                                 *
// *  POST /boat -> BoatController.create                                     *
// *  PUT /boat/:id -> BoatController.update                                  *
// *  DELETE /boat/:id -> BoatController.destroy    
// res.sendStatus(200); // equivalent to res.status(200).send('OK')
// res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
// res.status(403).send('Sorry! you cant see that.');


exports.create = function(req,res){
	ko = req.body;
	KO.create(ko, function(err,ko){
		if (err) console.log(err)
		res.status(200).json(ko);
	});
}

exports.find = function(req,res){
	var id = req.params.id;
	max_limit = 50;
	console.log(req.query)

	//findOne
	if (id) {
		console.log('findOne')
		ko_id = mongoose.Types.ObjectId(id);
		query = {"_id":ko_id};
		KO.findOne(query).exec().
		then(function(ko){
			res.json(ko)
		});	
	}

	//findAll
	else if (!id && !req.query){
		console.log(id)
		console.log(req.params.query)
		console.log('findAll')
		limit = (req.params.limit ? req.params.limit : max_limit);
		skip = (req.params.skip ? req.params.skip : 0);

		console.log(limit)
		KO.find({}).skip(skip).limit(limit).exec()
		.then(function(ko){
			res.json(ko)
		})
	}

	//find
	else{
		console.log('find -- query')
		var where = JSON.parse(req.query.where);
		console.log(where)
		if (!where) {res.status(404).send({"message":"No query passed"})}
		KO.find(where).exec().
		then(function(ko){
			res.json(ko)
		})
	}
}

exports.destroy = function(req, res){
	console.log('DESTROY')
	ko_id = mongoose.Types.ObjectId(req.params.id);
	query = {"_id":ko_id};
	KO.remove(query).exec()
	.then(function(ko){
		res.json(ko)
	})
}

exports.update = function(req,res){

}




// exports.checkCatalogPermission = function(req,res){
// 	catalog_id = mongoose.Types.ObjectId(req.params.catalog_id);
// 	user = req.params.user;
// 	permission_type = req.params.permission_type;

// 	permission_query = {
// 		"_id": catalog_id,
// 		"permission":{
// 						"$elemMatch":{
// 							"user":user,
// 							"permission":permission_type
// 						}
// 					}
// 	}

// exports.insertTestCatalogs = function(req,res){
// 	test_catalogs = []
// 	catalog_template = {
// 	"owner":"blaiszik",
// 	"name": "Ben's Catalog",
// 	"permission":[{"user":"blaiszik","permission":"r"}, {"user":"blaiszik","permission":"w"}],
// 	"tag":[{"key":"a","value":2}, {"key":"b","value":3}],
// 	"dataset": [{
// 			  "name":"DS1",
// 			  "uri": ["globus://go#ep1/file1.txt","globus://go#ep1/file2.txt"],
// 			  "tag":[{"key":"a","value":3}, {"key":"b","value":4}],
// 			  "data": ["a",1,2,3,"true"]
// 			},{
// 			  "name":"DS2",
// 			  "uri": ["globus://go#ep1/file2.txt","globus://go#ep1/file3.txt"],
// 			  "tag":[{"key":"a","value":5}, {"key":"b","value":6}],
// 			  "data": ["a",1,2,3,"true"]
// 			}],
// 	"uri":["globus://go#ep1/file1.txt","globus://go#ep1/file2.txt"]
// 	}

// 	num_catalogs = 1000
// 	for(i=0; i<num_catalogs; i++){
// 		test_catalogs.push(catalog_template)
// 		if (!(i%100)) {
// 			console.log("Test data insert "+i);
// 			cur_time = new Date().toISOString()
// 			console.log(cur_time)
// 		}
// 	}

// 	Catalog.create(test_catalogs,function(err,catalogs){
// 		if (err) console.log(err)
// 		cur_time = new Date().toISOString()
// 		console.log(cur_time)
// 		res.send({'success':true})
// 	});

// }


