'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  contactSchema;

contactSchema = new Schema({
  id: String,
  rawId: String,
  displayName: String,
  name: {},
  nickname: String,
  phoneNumbers: [],
  emails: [],
  addresses: [],
  "ims": String,
  "organizations": String,
  "birthday": Date,
  "note": String,
  "photos": [],
  "categories": String,
  "urls": []
}, { collection: 'contact' });

module.exports = mongoose.model('Contact', contactSchema);