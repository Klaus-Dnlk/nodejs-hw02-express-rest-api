import mongoose from 'mongoose'

const { Schema, SchemaTypes, model } = mongoose

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
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    },
}, 
{versionKey: false, 
    timestamps: false, 
    toJSON: {
        virtuals: true, 
        transform: function (doc, ret) {
            delete ret._id
            return ret
    }}, 
    toObject: {virtuals: true},
})

const Contact = model('contact', ContactSchema)

export default Contact