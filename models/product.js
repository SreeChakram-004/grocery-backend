'use strict';
const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

module.exports = (sequelize) => {
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    productPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0.01
      }
    },
    quantityPerKg:{
      type: DataTypes.INTEGER
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isFloat: true,
        min: 0,
        max: 100
      }
    },
    ourPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    hooks: {
      beforeSave: (product, options) => {
        const productPrice = product.productPrice;
        const discount = product.discount;
        const quantity = product.quantityPerKg

        if (productPrice && discount !== null) {
          const calculatedOurPrice = (productPrice * discount )/ 100;
          product.ourPrice = calculatedOurPrice * quantity;
        } else {
          product.ourPrice = null;
        }
      }
    }
  });

  return Product;
};
