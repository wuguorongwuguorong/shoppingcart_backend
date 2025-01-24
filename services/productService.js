const productData = require('../data/productData');


async function createProduct(name, price, image){
 if(name.length < 0){
  throw new Error('Please a name for your product');
}
  const existingProduct = await productData.getProductByName(name);
  if (existingProduct) {
    throw new Error('Product already Existed');
  }
  if(price.length < 0){
    throw new Error('Please give your product a price');
  }
}

async function getAllProducts() {
  return await productData.getAllProducts();
}

async function getProductById(id) {
  const product = await productData.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  // todo: check for promotion, special business logic (region blocking) etc.
  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct
};