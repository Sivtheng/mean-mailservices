const products = []; // This is a temporary in-memory store. Replace with database in production.

const resolvers = {
  Query: {
    getProducts: () => products,
    getProduct: (_, { id }) => products.find(product => product.id === id),
  },
  Mutation: {
    createProduct: (_, { name, description, price }) => {
      const newProduct = { id: String(products.length + 1), name, description, price };
      products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, { id, name, description, price }) => {
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return null;
      const updatedProduct = { ...products[index], name, description, price };
      products[index] = updatedProduct;
      return updatedProduct;
    },
    deleteProduct: (_, { id }) => {
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return false;
      products.splice(index, 1);
      return true;
    },
  },
};

module.exports = resolvers;
