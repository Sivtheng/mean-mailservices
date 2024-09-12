module.exports = {
  async up(db, client) {
    // Create Users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            role: { enum: ['buyer', 'seller'] },
            isVerified: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });

    // Create Products collection
    await db.createCollection('products', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'description', 'price', 'sellerId'],
          properties: {
            name: { bsonType: 'string' },
            description: { bsonType: 'string' },
            price: { bsonType: 'number' },
            sellerId: { bsonType: 'objectId' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ sellerId: 1 });
  },

  async down(db, client) {
    // Drop collections
    await db.collection('users').drop();
    await db.collection('products').drop();
  }
};
