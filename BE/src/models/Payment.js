const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    customer:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order:          { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    method:         { type: String, enum: ['cod', 'bank_transfer', 'e_wallet'], required: true },
    amount:         { type: Number, required: true, min: 0 },
    status:         { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transaction_id: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
