import mongoose from 'mongoose'

const { connect, connection } = mongoose

const uri = process.env.URI_DB

const db = connect(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
})

connection.on('connected', () => {
    console.log('Database connection successful');
})

connection.on('err', () => {
    console.log(`Mongoose connection error: ${Error.message}`);
})

connection.on('disconnected', () => {
    console.log('Database disconnected');
})


process.on('SIGINT', async () => {
    connection.close()
console.log('Connection db closed')
process.exit(1)
})

export default db
