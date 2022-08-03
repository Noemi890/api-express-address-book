const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const contacts = require("./contacts.js")

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

app.get("/contacts", (req, res) => {
  res.json({
    contacts
  })
})

app.get("/contacts/:id", (req, res) => {

  const id = Number(req.params.id)

  // console.log(id)

  const contact = contacts.find(contact => contact.id === id)

  // console.log(contact)
  
  res.json({contact})
})

app.post("/contacts", (req, res) => {
  const contact = req.body
  contact.id = contacts.length + 1
  contacts.push(contact)

  console.log(contacts)

  res.json({contact})
})

const port = 3030
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})