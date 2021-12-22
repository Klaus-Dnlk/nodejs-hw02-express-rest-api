const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')


const contactPath = path.join(__dirname, 'contacts.json')

const readContent = async() => {
  const content = await fs.readFile(contactPath, 'utf-8')
  return JSON.parse(content)
}

const writeContent = async(contacts) => {
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2))
}

const listContacts = async (req, res) => {
  const contacts = await readContent()
  res.json({contacts})
}

const getContactById = async (req, res) => {
  const contacts = await readContent()
 const { contactId } = req.params
 const contact = contacts.find(i => i.id === contactId)
 if(!contact){
   return res.status(404).json({message: "Not found"})
 }
 res.json( {contact} )
}

const addContact = async (req, res) => {
  const contacts = await readContent()
  const { 
    name, 
    email, 
    phone 
  } = req.body

  const newContact = {id: crypto.randomUUID(), name, email, phone}

  if(contacts.some(e => e.name === newContact.name || e.email === newContact.email || e.phone === newContact.phone)) {
    return res.json({message: "Sorry! Contact with this name, email or phone number already exists"})
  }
  contacts.push(newContact)
  await writeContent(contacts)
  res.status(201).json(newContact)
}


const removeContact = async (req, res) => {
  const contactId = req.params.id
  const contacts = await readContent()
  const contactToDelete = contacts.find(e => e.id === contactId)
  const filteredContacts = contacts.filter(e => e.id !== contactId)
  if(!contactToDelete){
    res.status(400).json({message: "Not found"})
    return
  }
  await writeContent(filteredContacts)
  res.status(204),json({message: "contact deleted"})
}


const updateContact = async (req, res) => {
  const contacts = await readContent() 
  const contactId = req.params.id
  const body = req.body
  const index = contacts.findIndex(e => e.id === contactId)
  if(index !== -1){
    const updatedContact = {id: contactId, ...contacts[index], ...body}
    contacts[index] = updatedContact
    await writeContent(contacts)
    return res.status(200).json(updatedContact)
  }
  return res.status(400),json({message: "Not found"})
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
