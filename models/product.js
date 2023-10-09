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
    category:{
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    quantityPerKg: {
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
        const productPrice = parseFloat(product.productPrice).toFixed(2);
        const discount = parseFloat(product.discount).toFixed(2);
        const quantity = parseFloat(product.quantityPerKg).toFixed(2);

        if (!isNaN(productPrice) && !isNaN(discount)) {
          const calculatedOurPrice = parseFloat(productPrice) - (parseFloat(productPrice) * parseFloat(discount) / 100);
          product.ourPrice = parseFloat(calculatedOurPrice * quantity).toFixed(2);
        } else {
          product.ourPrice = null;
        }
      }
    }
  });

  return Product;
};
