import repositoryContacts from '../../repository/contacts'
import { HttpCode, MESSAGE } from '../../lib/constans'
import { message } from '../../lib/messages' 

const getContacts = async (req, res, next) => {
  console.log(req.query)
  const contacts = await repositoryContacts.listContacts(req.query)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...contacts } })
}

  
const getContactById =  async (req, res, next) => {
    const { id } = req.params
    const contact = await repositoryContacts.getContactById(id)
    console.log(contact)
    if (contact) {
      return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: {contact}})
    }
    res.status(HttpCode.NOT_FOUND).json({ message: MESSAGE.NFD })
  }
  
const addContact = async (req, res, next) => {
    const newContact = await repositoryContacts.addContact(req.body)
    res.status(HttpCode.CREATED).json(newContact)
  }
  
const removeContact = async (req, res, next) => {
    const {id} = req.params
    const contact = await repositoryContacts.removeContact(id)
    if (contact) {
      return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: {contact}})
    }  
    res.status(HttpCode.NOT_FOUND).json({message:  message.nfd})
    }
  
const updateContact = async (req, res, next) => {
      const { id } = req.params
      const contact = await repositoryContacts.updateContact(id, req.body)
      if (contact) {
        return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: {contact}})
      }
      res.status(HttpCode.NOT_FOUND).json({ message:  message.nfd })
    }

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params
  const contact = await repositoryContacts.updateContact(id, req.body)
  if (contact) {
    return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: {contact}})
  }
  res.status(HttpCode.NOT_FOUND).json({ message:  message.nfd })
}
 
    export { getContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact}
