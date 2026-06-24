// User base model MUST be required first so discriminators can register on it
const User = require('./User');
const Seller = require('./Seller');
const Customer = require('./Customer');

const Address = require('./Address');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Product = require('./Product');
const Variant = require('./Variant');
const Voucher = require('./Voucher');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Payment = require('./Payment');
const Order = require('./Order');
const Shipping = require('./Shipping');
const OrderedItem = require('./OrderedItem');
const Review = require('./Review');

module.exports = {
  User,
  Seller,
  Customer,
  Address,
  Category,
  SubCategory,
  Product,
  Variant,
  Voucher,
  Cart,
  CartItem,
  Payment,
  Order,
  Shipping,
  OrderedItem,
  Review,
};
