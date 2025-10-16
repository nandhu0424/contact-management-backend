const Joi = require('joi');
const Contact = require('../models/Contact');

const contactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  notes: Joi.string().allow('', null)
});

// Create contact
exports.createContact = async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    // check duplicates for this user
    const duplicate = await Contact.findOne({
      createdBy: req.user.id,
      $or: [{ phone: value.phone }, { email: value.email }]
    });
    if (duplicate) return res.status(409).json({ status: 'error', message: 'Contact with same phone/email exists' });

    const contact = new Contact({ ...value, createdBy: req.user.id });
    await contact.save();
    res.status(201).json({ status: 'success', message: 'Contact created', data: contact });
  } catch (err) {
    next(err);
  }
};

// List contacts with pagination, search, sort
exports.getContacts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const filter = { createdBy: req.user.id };
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [items, total] = await Promise.all([
      Contact.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Contact.countDocuments(filter)
    ]);

    res.json({
      status: 'success',
      message: 'Contacts retrieved',
      data: {
        items,
        meta: { total, page, limit, pages: Math.ceil(total / limit) }
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get single contact
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ status: 'error', message: 'Contact not found' });
    if (contact.createdBy.toString() !== req.user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    res.json({ status: 'success', data: contact });
  } catch (err) {
    next(err);
  }
};

// Update contact
exports.updateContact = async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ status: 'error', message: 'Contact not found' });
    if (contact.createdBy.toString() !== req.user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    // check duplicates (other contacts)
    const dup = await Contact.findOne({
      createdBy: req.user.id,
      _id: { $ne: contact._id },
      $or: [{ phone: value.phone }, { email: value.email }]
    });
    if (dup) return res.status(409).json({ status: 'error', message: 'Another contact with same phone/email exists' });

    contact.name = value.name;
    contact.phone = value.phone;
    contact.email = value.email;
    contact.notes = value.notes;
    await contact.save();

    res.json({ status: 'success', message: 'Contact updated', data: contact });
  } catch (err) {
    next(err);
  }
};

// Delete contact
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ status: 'error', message: 'Contact not found' });
    if (contact.createdBy.toString() !== req.user.id) return res.status(403).json({ status: 'error', message: 'Forbidden' });

    await Contact.deleteOne({ _id: contact._id });
    res.json({ status: 'success', message: 'Contact deleted' });
  } catch (err) {
    next(err);
  }
};
