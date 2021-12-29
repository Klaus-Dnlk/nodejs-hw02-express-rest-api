import pkg from 'mongoose'

const { Schema, model } = pkg

const UserSchema = new Schema ({
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
      }, {versionKey: false, 
        timestamps: false, 
        toJSON: {virtuals: true, 
        transform(doc, ret) {
        delete ret._id
        return ret
    }}, toObject: {}}
)

const User = model('user', UserSchema)

export default User