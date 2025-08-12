const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.xxtcc.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name : String,
  number : String
})

const Person = mongoose.model('Person',personSchema)

const person = new Person({
  name,
  number
})

if(process.argv.length === 3){
  Person.find({}).then(result => {
    console.log(result)
    mongoose.connection.close()
  })
} else{
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

