const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI not provided');
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB connected');
};

module.exports = connectDB;
