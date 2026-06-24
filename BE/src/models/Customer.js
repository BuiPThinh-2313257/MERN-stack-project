const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');

const customerSchema = new Schema({
  date_of_birth: { type: Date },
  sex:           { type: String, enum: ['male', 'female', 'other'] },
  addresses:     [{ type: Schema.Types.ObjectId, ref: 'Address' }],
});

const Customer = User.discriminator('customer', customerSchema);

module.exports = Customer;
