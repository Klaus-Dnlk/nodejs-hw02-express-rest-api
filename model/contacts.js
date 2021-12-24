import pkg from 'mongoose'

const { Schema, model } = pkg

const ContactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contacts'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false
    }
}, {versionKey: false, 
    timestamps: false, 
    toJSON: {virtuals: true, 
    transform(doc, ret) {
    delete ret._id
    return ret
}}, toObject: {}})

const Contact = model('contact', ContactSchema)

export default Contact