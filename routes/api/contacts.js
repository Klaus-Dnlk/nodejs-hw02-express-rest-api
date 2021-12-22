const express = require('express')
const router = express.Router()
const { validateCreate, validateUpdate } = require('../../middlewares/addContactMiddleware')
const { 
  listContacts, 
  getContactById, 
  addContact, 
  removeContact, 
  updateContact 
} = require('../../model/index')

router.get('/', listContacts)

router.get('/:contactId', getContactById)

router.post('/', validateCreate, addContact)

router.delete('/:contactId', removeContact)

router.put('/:contactId', validateUpdate, updateContact)

module.exports = router
