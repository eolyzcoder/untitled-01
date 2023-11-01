import Mongoose from 'mongoose'

export const USER_SCHEMA = 'Users'

const Schema = Mongoose.Schema
const UserSchema = new Schema({
    emailAddress: { type: Schema.Types.String, default: '' },
    phoneNumber: { type: Schema.Types.String, default: '', },
    countryCode: { type: Schema.Types.String, default: '' },
    name: { type: String, default: '', },
    userName: { type: String, default: '' },
    profileImage: { type: String, default: 'public/default_profile.png' },
    deviceToken: { type: String, default: '', },
    location: { type: Object, default: null, },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: false, getters: true },
    toJSON: { virtuals: false, getters: true },
})


export const Users = Mongoose.model(USER_SCHEMA, UserSchema)