const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderID:{
        type:String
    },

    product: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: {type: Number} || 0
    }],
    
    totalPrice: {type: Number},

    totalQuantity: {type: Number},

    discount: {type: Number},

    customer:{
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        name: {type: String},
        address: {type: String},
        email: {type: String},
        phone: {type: String},
    },

    staffId: {type: mongoose.Schema.Types.ObjectId, ref: 'staff'},

    status: {
        type: String,
        enum:['Chờ xác nhận', 'Đã xác nhận','Hoàn thành', 'Hủy'],
        default: 'Chờ xác nhận',
    },

    paymentMethod:{type:String, enum:['COD', 'Card']},

    createdDate:{type: Date},

    delieveryDate: {type: Date},

});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;