const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save()
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch(err => console.log(err));
  req.user.createProduct({ //this way we need not have to explicitly pass "userId"
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  })
  //"createProduct" is a special method created by sequelize when "relation(association)"
  //is defined

  // Product.create({ //one way by which we insert product with user details
  //   title: title,
  //   price: price,
  //   description: description,
  //   imageUrl: imageUrl,
  //   userId : req.user.id
  // })
    .then( result => {
      console.log("Created Product");
      res.redirect('/admin/products');
    })
    .catch( err => {
      console.log(err);
    })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));

  // Product.findById(prodId, product => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDesc;
      return product.save();
      //product.save() will updated the matching record or if no such product exist add it to table
      //also it returns promise so we are returning it to avoid nesting of the promises one
      //inside another, instead chaining it as below === PROMISE CHAINING
    })
    .then(result => {
      console.log("Product updated!!!");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts() //it will bring only products where "userId" is one set in "req.user.id"
  //"getProducts" is special method exposed by sequelize on defining relation(association)

  //Product.findAll() //brings all products from database table
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //Product.destroy({ where : { id : prodId }}); //we can use this also, there can be other
  // ways also
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy(); //this way no WHERE attribute was required
      //It will also return Promise which we would chain by returning it
    })
    .then(result => {
      console.log("Product Deleted!!!");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  // Product.deleteById(prodId);
  // res.redirect('/admin/products');
};
