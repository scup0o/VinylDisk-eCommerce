const ApiError = require("../api-error");
const Order = require("../models/order.model");
const {ObjectId} = require("mongodb");
const User = require("../models/user.model");
const sendEmail = require("../utils/nodemailer");
const crypto = require("crypto");
const Product = require("../models/product.model")
const Staff = require("../models/staff.model")


exports.create = async (req, res, next) => {
    try{
        let check;
        let id;
        do{
            id = crypto.randomBytes(5).toString('hex');
            check = await Order.findOne({orderID: id})
            console.log(check)
        } while (check)
        
        req.body.createdDate = new Date();
        req.body.orderID = id
        console.log(req.body)

        let order = await Order.create(req.body);
        
        let item = {productId: { type: new ObjectId() },
        quantity: { type: Number },};
        let count = 0;
        for (const [key, value, index] of Object.entries(req.body)) {
            if (key === `product[${count}][_id]`) {
              item.productId = value;
            }
            if (key === `product[${count}][cartQuantity]`) {
              item.quantity = value;
              count++;
              order = await Order.findByIdAndUpdate(order._id,{$push: {product: item}})
            }
          }
        
        console.log(req.body)
          let customer;

        if (!req.body.userid) {
            customer = {name: req.body.name, email: req.body.email, id: null, phone: req.body.phone, address: req.body.address}
            const check = await User.findOne({email: req.body.email})
            console.log(check)
            if (check) {
                order = await Order.findByIdAndRemove(order._id);
                return res.send('email');}

            else{
            
            
            order = await Order.findByIdAndUpdate(order._id, {customer: customer})
            const message = `đơn hàng đã được tạo`;
                        await sendEmail(customer.email, "Đơn đặt hàng", message);
            console.log(order);
            order = await Order.findById(order._id).populate({path: 'product', populate:{path:'productId'}})
            return res.send(true);}
        }
        else {
            customer = {name: req.body.name, email: req.body.email, id: new ObjectId(req.body.userid), phone: req.body.phone, address: req.body.address}
            order = await Order.findByIdAndUpdate(order._id, {customer: customer})
            console.log(order)
            return res.send(true);}

          
    
    }
    catch(error){
        console.log(error)
        return next(new ApiError(500,"An error occurred while creating the order"));
    }
};

exports.findAll = async (req, res, next) => {
    let orders = [];

    try{
        const {name} = req.query;
        if (name){
            orders = await Order.find({
                name: { $regex: new RegExp(name), $options: "i"},
            });
        }
        else {
            orders = await Order.find({})
            orders.forEach(async order=>{
                if (order.staffId){
                    let check= await Staff.findById(order.staffId)
                    console.log(check)
                    if (!check){
                        order.staffId=null;
                    }
                    console.log(order)
                }
            })
            orders = await Order.find({}).populate({path: 'product', populate:{path:'productId'}}).populate('staffId');
        }
    }
    catch(error){
        console.log(error)
        return next(new ApiError(500, "An error occurred while retrieving orders"));
    }

    return res.send(orders);
};

exports.findOne = async (req, res, next) => {
    try {
        const orders = await Order.find({'customer.id': req.params.id}).populate({path: 'product', populate:{path:'productId'}});
        if (!orders) {
            return next(new ApiError(404, "Order not found"));
        }
        console.log(orders)
        return res.send(orders);
    }
    catch(error){
        return next(new ApiError(500, `Error retrieving order with id = ${req.params.id}`));
    }
};

exports.findbyname = async (req, res, next) =>{
    try{
        console.log(req)
        const order = await Order.findOne({name: req.body.name})
        console.log(order);
        res.send(order)
    }
    catch(error){
        console.log(error);
    }
}

exports.update = async(req, res, next) => {
    /*if (Object.keys(req.body).length === 0){
        return next(new ApiError(404, "Data to update can not be empty"));
    }*/

    try {
            console.log(req.body);
            if (req.body.status==='Đã xác nhận'){
                let temp;
                let item = {productId: { type: new ObjectId() },
                            quantity: { type: Number }, cartQuantity:{type:Number}};
                            let count = 0;
                for (const [key, value, index] of Object.entries(req.body)) {
                    if (key === `product[${count}][productId][_id]`) {
                      item.productId = value;
                    }
                    if (key === `product[${count}][productId][quantity]`) {
                      item.quantity = value;
                    }
                    if (key === `product[${count}][quantity]`) {
                        item.cartQuantity = value;
                        count++;
                        let check =parseInt(item.quantity) - parseInt(item.cartQuantity)
                        if (check >= 0){
                                temp = await Product.findByIdAndUpdate(item.productId,{quantity: check})}
                                else return res.send('quantity');
                    }
                  }
            }
            if (req.body.status==='back'){
                req.body.status='Hủy'
                let temp;
                let item = {productId: { type: new ObjectId() },
                            quantity: { type: Number }, cartQuantity:{type:Number}};
                            let count = 0;
                for (const [key, value, index] of Object.entries(req.body)) {
                    if (key === `product[${count}][productId][_id]`) {
                      item.productId = value;
                    }
                    if (key === `product[${count}][productId][quantity]`) {
                      item.quantity = value;
                    }
                    if (key === `product[${count}][quantity]`) {
                        item.cartQuantity = value;
                        count++;
                        let check =parseInt(item.quantity) + parseInt(item.cartQuantity)
                                temp = await Product.findByIdAndUpdate(item.productId,{quantity: check})
                    }
                  }
            }
            if(req.body.status==='Hoàn thành'){
                req.body.delieveryDate = new Date();
            }
            let order = await Order.findByIdAndUpdate(req.params.id, req.body);
            order = await Order.findOne({orderID: order.orderID}).populate('staffId');
            /*if (order.customer.id===null){
                const message = `Trạng thái đơn hàng mã ${order.orderID} là: ${order.status}`;
                        await sendEmail(order.customer.email, `Cập nhật trạng thái đơn hàng mã ${order.orderID}`, message);
            }*/
            //console.log(req.body.tracklist)
            /*if(req.body.tracklist){
                if ((req.body.tracklist).length !=0){
                            order= await Order.updateOne({_id: order._id, tracklist : order.tracklist},
                                                            {$set: {tracklist: req.body.tracklist}})
                }
            }*/
            console.log(order);
            if (!order) {
                console.log('no')
                return next(new ApiError(404, "Order not found"));
            }
        res.send(order)
        console.log({ message: "Order was updated successfully" });
    }
    catch (error){
        console.log(error);
        return next(new ApiError(500, `Error update order with id = ${req.params.id}`))
    }
}

exports.delete = async(req, res, next) => {
    try{
        console.log(req.params.id);
        const order = await Order.findByIdAndRemove(req.params.id);
        if (!order){
            console.log('order not found');
            res.send(false)
            //return next(new ApiError(404, "Order not found"));
        }
        console.log('success')
        console.log(order.name);
        res.send(true);
        //return res.send({ message: "Order was deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.send(false)
        //return next(new ApiError(500, `Could not delete order with id = ${req.params.id}`))
    }
}

exports.deleteAll = async(_req, res, next) => {
    try{
        const deletedCount = await Order.deleteMany({});
        res.send(deletedCount);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while removing all orders"))
    }
}