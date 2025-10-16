module.exports = (err, req, res, next) => {
  console.error(err);
  // Duplicate key (unique index) error
  if (err.code && err.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'Duplicate key error', details: err.keyValue });
  }
  res.status(500).json({ status: 'error', message: err.message || 'Internal Server Error' });
};
