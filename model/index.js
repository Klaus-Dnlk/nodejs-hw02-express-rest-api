const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

// const contacts = require('./contacts.json')

const contactPath = path.join(__dirname, 'contacts.json')

const readContent = async() => {
  const content = await fs.readFile(contactPath, 'utf-8')
  const result = JSON.parse(content)
  return result
}

const listContacts = async (req, res) => {
  const contacts = await readContent()
  res.json({contacts, status: 200})
}

const getContactById = async (req, res) => {
  const contacts = await readContent()
 const {id} = req.params
 const [contact] = contacts.filter(i => i.id ===id)
 if(!contacts){
   return res.status(404).json({status: "Not found"})
 }
 res.json({contact, status:200})
}

const addContact = async (req, res) => {
  const contacts = await readContent()
  const { 
    name, 
    email, 
    phone 
  } = req.body

  if (contacts.some(e => e.name === undefined || e.email === undefined || e.phone === undefined)) {
    return ({status:400, message:'missing required name field'})
  }
  contacts.push({
    name,
    email,
    phone,
    id: crypto.randomUUID()
  })
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2))
  res.json({status:201})
}


const removeContact = async (contactId) => {
  const contacts = await readContent()
  const foundContact = contacts.find(e => e.id === contactId)
  const filteredContacts = contacts.filter(e => e.id !== contactId)
  if (foundContact) {
    await fs.writeFile(contactPath, JSON.stringify(filteredContacts, null, 2))
    return filteredContacts
  }
}


const updateContact = async (contactId, body) => {
  const contacts = await readContent()
  const { name, email, phone } = body

  contacts.forEach(contact => {
    if (contact.id === contactId) {
      contact.name = name,
      contact.email = email,
      contact.phone = phone
    }
  })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
