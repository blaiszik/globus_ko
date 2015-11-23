var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Collection = require('../models/Collection');
var KO = require('../models/KO');
var secrets = require('../config/secrets');
var mongoose = require('mongoose');

// *  GET /colleciton -> .find                                     							*
// *  GET /collection/:id -> .find                                 							*
// *  GET /collection/:collection_id/add/:member_id -> .add                     			*
// *  POST /collection -> .create                                     						*
// *  PUT /collection/:id -> .update                                  						*
// *  DELETE /collection/:id -> .destroy    												*

//Helper functions
convert_to_bson = function(arr) {
  console.log(arr)
  bson_array = []
  if (arr.length){
  	for (i=0; i<arr.length; i++){
  		bson_array.push(mongoose.Types.ObjectId(arr[i]))
  	}
  	return bson_array;
  }
}

//Exported functions
exports.create = function(req,res){
	collection = req.body;

	for (i=0; i<collection.length; i++){
		collection[i].member = convert_to_bson(collection[i].member);
	}

	Collection.create(collection, function(err,collection){
		if (err) console.log(err)
		res.status(200).json(collection);
	});
}

exports.find = function(req,res){
	var id = req.params.id;
	max_limit = 50;

	//findOne
	if (id) {
		console.log('findOne')
		collection_id = mongoose.Types.ObjectId(id);
		query = {"_id":collection_id};
		Collection.findOne(query).exec().
		then(function(collection){
			res.json(collection)
		});	
	}

	//findAll
	else if (!id && !req.query){
		console.log('findAll')
		limit = (req.params.limit ? req.params.limit : max_limit);
		skip = (req.params.skip ? req.params.skip : 0);

		console.log(limit)
		Collection.find({}).skip(skip).limit(limit).exec()
		.then(function(collection){
			res.json(collection)
		})
	}

	//find
	else{
		var where = JSON.parse(req.query.where);
		if (!where) {res.status(404).send({"message":"No query passed"})}
		Collection.find(where).exec().
		then(function(collection){
			res.json(collection)
		})
	}
}

exports.destroy = function(req, res){
	collection_id = mongoose.Types.ObjectId(req.params.id);
	query = {"_id":collection_id};
	Collection.remove(query).exec()
	.then(function(collection){
		res.json(collection)
	})
}

exports.update = function(req,res){

}

exports.add = function(req,res){
	collection_id = mongoose.Types.ObjectId(req.params.collection_id);
	member_id = mongoose.Types.ObjectId(req.params.member_id);
	data_type = req.params.data_type.toLowerCase();

	Collection.update({"_id":collection_id},{$pushAll: {member:[member_id]}},
					  {upsert:true}).exec().
	then(function(err){
		if(err) {
	    	console.log(err)
	    }
	    res.json({"success":true})
	});
}

exports.get_member = function(req,res){
	collection_id = mongoose.Types.ObjectId(req.params.id);
	//Right now collection members can only be KOs, could easily expand to be KOs or other collections
	Collection.findOne({"_id": collection_id}).exec().
	then(function(collection){
		KO.find({"_id":{"$in":collection.member}}).exec().
		then(function(ko){
			res.json(ko)
			console.log(ko)
		})
	})
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


