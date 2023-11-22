const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.get = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.send(cart);
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    //console.log(req.body._id)
    let check = await Cart.findOne({ userId: req.params.id });
    if (!check) {
      check = await Cart.create({
        userId: req.params.id,
        product: [] /* totalPrice: 0*/, totalQuantity: 0,
      });
      console.log(check);
    }
    check = await Cart.findOne({ userId: req.params.id });
    //console.log(check)
    console.log(req.body);

    //all
    if (req.body.util === "all") {
      let count = 0;
      let newproduct = [];
      let newProduct = {
        productId: { type: new ObjectId() },
        quantity: { type: Number },
      };
      let cart = await Cart.findByIdAndUpdate(check._id, {/*totalPrice: req.body.totalPrice,*/ totalQuantity: req.body.totalQuantity})
      
      let quantityCount=0;
       /*     let priceCount =0;*/

      for (const [key, value, index] of Object.entries(req.body)) {
        if (key === `product[${count}][productId]`) {
          newProduct.productId = value;
          console.log(key);
        }
        if (key === `product[${count}][quantity]`) {
          newProduct.quantity = value;
          console.log(newProduct);
          count++;

          let index = check.product.findIndex(
            (x) => x.productId.toString() === newProduct.productId.toString()
          );
          let daProduct = await Product.findOne({ _id: newProduct.productId });
          console.log(index);
          if (index === -1) {
            cart = await Cart.findByIdAndUpdate(check._id, {
              $push: { product: newProduct },
            });
            //console.log(cart)
            console.log(parseInt(newProduct.quantity))
                          quantityCount=parseInt(newProduct.quantity)+quantityCount;
                          /*console.log(quantityCount);
                          if (daProduct.discount > 0) priceCount = (((daProduct.price)-(daProduct.price)*(daProduct.discount/100)))*parseInt(newProduct.quantity) + priceCount
                          else priceCount = (daProduct.price)*parseInt(newProduct.quantity) + priceCount*/
          } else {
            if (
              check.product[index].quantity + parseInt(newProduct.quantity) >
              daProduct.quantity
            ) {
              cart = await Cart.updateOne(
                {
                  userId: req.params.id,
                  "product.productId": newProduct.productId,
                },
                { $set: { "product.$.quantity": daProduct.quantity } }
              );
              quantityCount = (daProduct.quantity-check.product[index].quantity) + quantityCount;
                              /*if (daProduct.discount > 0) priceCount = (((daProduct.price)-(daProduct.price)*(daProduct.discount/100)))*(daProduct.quantity-check.product[index].quantity) + priceCount
                              else priceCount = (daProduct.price)*(daProduct.quantity-check.product[index].quantity) + priceCount*/
            } else {
              cart = await Cart.updateOne(
                { userId: req.params.id, "product.productId": req.body._id },
                {
                  $set: {
                    "product.$.quantity":
                      check.product[index].quantity +
                      parseInt(newProduct.quantity),
                  },
                }
              );
              quantityCount=parseInt(newProduct.quantity)+quantityCount;
                              /*if (daProduct.discount > 0) priceCount = (((daProduct.price)-(daProduct.price)*(daProduct.discount/100)))*parseInt(newProduct.quantity) + priceCount
                              else priceCount = (daProduct.price)*parseInt(newProduct.quantity) + priceCount*/
            }
          }
        }
      }
      //console.log(newproduct)
      //console.log(quantityCount)
      cart = await Cart.findByIdAndUpdate(check._id, {/*totalPrice: check.totalPrice+priceCount,*/ totalQuantity: check.totalQuantity+quantityCount})
      console.log(cart);
      res.send(true);
    }

    //add
    if (req.body.util === "add") {
      let index = -1;
      console.log(check);
      const item = { productId: new ObjectId(req.body._id), quantity: 1 };
      /*req.body.discount = parseInt(req.body.discount); req.body.price = parseInt(req.body.price)
            if (req.body.discount > 0) req.body.afterprice = ((req.body.price)-(req.body.price)*(req.body.discount/100))
            else req.body.afterprice = req.body.price
            console.log(req.body.afterprice)*/
      index = check.product.findIndex(
        (x) => x.productId.toString() === item.productId.toString()
      );
      console.log(index);

      if (index === -1) {
        let cart = await Cart.findByIdAndUpdate(check._id, {
          $push: {
            product: item,
          }, totalQuantity: check.totalQuantity+1, /*totalPrice: check.totalPrice+req.body.afterprice,*/
        });
        console.log(cart);
        res.send("added");
      } else {
        console.log(check.product[index].quantity);
        console.log(req.body.quantity);
        if (check.product[index].quantity == req.body.quantity) {
          console.log("quantity");
          res.send("quantity");
        } else {
          let cart = await Cart.updateOne(
            { userId: req.params.id, "product.productId": req.body._id },
            {
              $set: { "product.$.quantity": check.product[index].quantity + 1 },
            }
          );
          cart = await Cart.updateOne({userId: req.params.id},
                                                    {$set: {"totalQuantity": check.totalQuantity+1}})
          console.log(cart);
          res.send("added");
        }
      }
    }

    //minus
    if (req.body.util === "minus") {
      let index = -1;
      const item = { productId: new ObjectId(req.body._id), quantity: 1 };
      /*req.body.discount = parseInt(req.body.discount); req.body.price = parseInt(req.body.price)
            if (req.body.discount > 0) req.body.afterprice = ((req.body.price)-(req.body.price)*(req.body.discount/100))
            else req.body.afterprice = req.body.price
            console.log(req.body.afterprice)*/
      index = check.product.findIndex(
        (x) => x.productId.toString() === item.productId.toString()
      );
      let quantity = check.totalQuantity -  check.product[index].quantity
      if (req.body.cartQuantity == 0) {
        let cart = await Cart.updateOne(
          { _id: check._id },
          {totalQuantity: quantity, $pull: { product: { productId: req.body._id } } }
        );
      } else {
        let cart = await Cart.updateOne(
          { userId: req.params.id, "product.productId": req.body._id },
          { $set: { "product.$.quantity": check.product[index].quantity - 1 } }
        );
        cart = await Cart.updateOne({userId: req.params.id},
                                                    {$set: {"totalQuantity": check.totalQuantity-1}})
        console.log(cart);
        res.send("remove one");
      }
    }

    //update
    if (req.body.util === "update") {
      let q = check.totalQuantity -  check.product[index].quantity
      let index = check.product.findIndex(
        (x) => x.productId.toString() === req.body._id.toString()
      );
      if (parseInt(req.body.cartQuantity) == 0) {
        let cart = await Cart.updateOne(
          { _id: check._id },
          {totalQuantity: q,$pull: { product: { productId: req.body._id } }}
        );
      } else {
        let q2 = q + req.body.cartQuantity
        let cart = await Cart.updateOne(
          { userId: req.params.id, "product.productId": req.body._id },
          {totalQuantity: q2, $set: { "product.$.quantity": parseInt(req.body.cartQuantity) },  }
        );
      }
    }

    //updateMore
    if (req.body.util === "updateMore") {
      let index = check.product.findIndex(
        (x) => x.productId.toString() === req.body._id.toString()
      );
      if (index == -1) {
        let newProduct = {
          productId: req.body._id,
          quantity: req.body.cartQuantity,
        };
        let cart = await Cart.updateOne(
          { _id: check._id },
          { $push: { product: newProduct }, totalQuantity: check.totalQuantity+parseInt(req.body.cartQuantity)}
        );
        console.log('push');
        res.send('added');
      } else { let temp =(await Product.findOne({_id:req.body._id})).quantity
        if (
          check.product[index].quantity + parseInt(req.body.cartQuantity) >
          temp
        ) {
         
          temp = temp - check.product[index].quantity
          console.log(check.product[index].quantity)
          console.log(temp)
          console.log('quantity')
          res.send(`${temp}`);
        } else {
          let cart = await Cart.updateOne(
            { userId: req.params.id, "product.productId": req.body._id },
            {
              $set: {
                "product.$.quantity":
                parseInt(req.body.cartQuantity) + check.product[index].quantity,
              },
              totalQuantity: check.totalQuantity+parseInt(req.body.cartQuantity)
            }
          );
          console.log('plus')
          res.send("added");
        }
      }
    }

    //updateAll
    if (req.body.util === "updateAll") {
      let newProduct = {};
      let count = 0;
      let tempQuantity = 0;
      let cart = await Cart.findByIdAndUpdate(
        {
          _id: check._id,
        },
        { product: [] /* totalPrice: 0, totalQuantity: 0*/ }
      );
      //console.log(req.body)
      for (const [key, value, index] of Object.entries(req.body)) {
        if (key === `product[${count}][productId]`) {
          newProduct.productId = value;
        }
        if (key === `product[${count}][quantity]`) {
          newProduct.quantity = value;
          //console.log(newProduct);
          count++;
          tempQuantity = tempQuantity + parseInt(newProduct.quantity);
          cart = await Cart.findByIdAndUpdate(check._id, {
            $push: {
              product: newProduct,
            },
          });
        }
      }
      cart = await Cart.findByIdAndUpdate(check._id, {
        totalQuantity : tempQuantity
      });
      res.send(true)
    }
  } catch (error) {
    console.log(error);
  }
};

exports.removeItem = async (req, res, next) => {};

exports.delete = async (req, res, next) => {};
