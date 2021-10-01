//functionality without MySQL query may fail while working with products
//as currently we have products table only
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//it will only get executed after server is started by "app.listen(3000)" method in our case
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user; //"user" property is not in-built on "req" but here we are
            //simply adding a property like we do in any other javascript object,
            //kepp in mind not to overwrite "req" objects in-built property
            next(); //to pass control to subsequent middlewares with extra property
            //in "req" object named "user", here user will be sequelize object not the 
            //normal object
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//before syncing to database we should define relation(Association) between their tables(models)
Product.belongsTo(User,{
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through : CartItem});
Product.belongsToMany(Cart, { through : CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through : OrderItem});
Product.belongsToMany(Order, { through : OrderItem});
//below code syncs database model with our database and only start the application if
//connection is successful, also checks if table exists and only creates table if 
//it is not there already in database
sequelize
    //.sync({ force: true}) //generally we won't use "force" because it will drop tables if required 
                          //to define relation(association) and doesn't require always otherwise
                          //every time it will tey to define relation(association)
    .sync()
    .then(result => {
        // console.log(result);
        // app.listen(3000);
        return User.findByPk(1);//just checking if user exist though it will not be correct in real world
    })
    .then(user => {
        if(!user){
            return User.create({
                name: "TestUser",
                email: "test@test.com"
            }); //returns promise
        }

        return user; //returns Object, but if we use "return" inside then block it will be
        //converted to Promise
        //return Promise.resolve(user) //if we explicitly wanted to return promise inside or
        //outside then block
    })
    .then(user => {
        return user.createCart(); //will create cart for user
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch( err => {
        console.log(err);
    });

// app.listen(3000);
