const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// All contact routes require auth
router.use(auth);

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
