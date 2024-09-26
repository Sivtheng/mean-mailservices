const Product = require('../models/Product');

class NewsletterService {
    static async generateNewsletterContent() {
        const featuredProducts = await Product.find().sort('-createdAt').limit(5);

        let content = '<h2>Featured Products</h2>';
        featuredProducts.forEach(product => {
            content += `
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price.toFixed(2)}</p>
        </div>
      `;
        });

        return content;
    }
}

module.exports = NewsletterService;