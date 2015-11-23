var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var tagSchema = new mongoose.Schema({
  "key":String,
  "value":Schema.Types.Mixed,
  _id:false
})

// var memberSchema = new mongoose.Schema({
//   "data_type":{type:String, enum: ['collection','KO']},
//   "_id": Schema.Types.ObjectId
// })

var collectionSchema = new mongoose.Schema({
  owner:{type:String, lowercase:true},
  name:String,
  tag:[tagSchema],
  uri:['String'],
  member:[Schema.Types.ObjectId],
  data_type: {type:String, default:"collection"},
  date_created: Date,
  date_updated: Date
});

collectionSchema.pre('save', function(next) {
    if (!this.date_created) {
        this.data_created = new Date();
    }

    if (!this.date_updated) {
        this.date_updated = new Date();
    }
    next();
});

// collectionSchema.pre('validate', function(next) {
//     if (this.isModified('created_on')) {
//         this.invalidate('created_on');
//     }
// });

module.exports = mongoose.model('Collection', collectionSchema);