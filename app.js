const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
var bodyParser = require("body-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());


//routes
const productsRouter = require("./app/routes/product.route");
const authRouter = require("./app/routes/auth.route");
const discountCodeRouter = require("./app/routes/discountCode.route");
const staffRouter = require("./app/routes/staff.route");
const userRouter = require("./app/routes/user.route");
const genreRouter = require("./app/routes/genre.route");
const artistRouter = require("./app/routes/artist.route");
const cartRouter = require("./app/routes/cart.route")
const orderRouter = require("./app/routes/order.route")
const favoriteRouter = require("./app/routes/favorite.route")


const { checkUser } = require("./app/middlewares/auth.middleware");

//app.get("*", checkUser);
app.get("/",(req, res) =>{
    res.json( {message: "vinyl disk"} );
});
app.use("/api/product", productsRouter);
//app.use("/api/auth", authRouter);
app.use("/api/genre",genreRouter);
app.use("/api/artist",artistRouter);
app.use("/api/user", userRouter);
app.use("/api/staff",staffRouter);
app.use("/api/discountcode",discountCodeRouter);
app.use("/api/cart",cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/favorite", favoriteRouter)


//upload img
app.post("/api/img", (req,res) =>{
    try{
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log(req);
        console.log('no');
        return res.status(400).send('No files were uploaded.');
      }
    else{
        //console.log(req);
        let temp = req.files;
        console.log(temp)
        let fileuploaded = Object.values(req.files)[0];
        //let fileuploaded = req.files
        console.log(Object.values(fileuploaded))
        temp=Object.values(fileuploaded);
        console.log(temp[0].name);
        var uploadedFiles = []
        if(fileuploaded.length > 1){
            for (let i = 0; i < fileuploaded.length; i++) {
                fileuploaded[i].mv(__dirname + '/../frontend/admin/src/assets/img/' + fileuploaded[i].name , function(err) {
                    if (err){
                        console.log(err)
                      return res.status(500).send(err);
                    }
                    
                      console.log(`uploaded at ${this._dirname}`)
                    //res.send('File uploaded!');  
                    
                  });
                  fileuploaded[i].mv(__dirname + '/../frontend/user/src/assets/img/' + fileuploaded[i].name , function(err) {
                    if (err){
                        console.log(err)
                      return res.status(500).send(err);
                    }
                    
                      console.log(`uploaded at ${this._dirname}`)
                    //res.send('File uploaded!');  
                    
                  });
            }
            res.send(true);
        }
        else{
            // Use the mv() method to place the file somewhere on your server
            fileuploaded.mv(__dirname + '/../frontend/admin/src/assets/img/' + fileuploaded.name , function(err) {
                if (err){
                    console.log(err)
                //return res.status(500).send(err);
            }
                
                console.log(`uploaded at ${this._dirname}`)
                //res.send(window.alert("I am an alert box!")); 
            });
            fileuploaded.mv(__dirname + '/../frontend/user/src/assets/img/' + fileuploaded.name , function(err) {
                if (err){
                    console.log(err)
                //return res.status(500).send(err);
            }
                
                console.log(`uploaded at ${this._dirname}`)
                //res.send(window.alert("I am an alert box!")); 
            });
            res.send(true)
        }
    }
    }
    catch(error){
        console.log(error)
    }
    //next();
})

//404 
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;