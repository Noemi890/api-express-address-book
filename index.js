const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const contacts = require("./contacts.js")
const meetings = require("./meetings.js")

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

  const contact = contacts.find(contact => contact.id === id)
  
  res.json({contact})
})

app.get("/contacts/:id/meetings", (req, res) => {
  const id = req.params.id

  const specificMeetings = meetings.filter(meet => meet.contactId === id)

  res.json({meetings: specificMeetings})
})

app.put("/contacts/:id", (req, res) => {
  const modifiedContact = req.body
  const id = Number(req.params.id)
  modifiedContact.id = id

  const contact = contacts.find(contact => contact.id === id)
  const index = contacts.indexOf(contact)

  contacts.splice(index, 1, modifiedContact)

  res.json({contact: modifiedContact})
})

app.post("/contacts", (req, res) => {
  const contact = req.body
  contact.id = contacts.length + 1
  contacts.push(contact)

  console.log(contacts)

  res.json({contact})
})

app.post("/contacts/:id/meetings", (req, res) => {
  const id = req.params.id
  const newMeeting = req.body

  newMeeting.id = meetings.length
  newMeeting.contactId = id

  meetings.push(newMeeting)

  res.json({meeting: newMeeting})
})

app.delete("/contacts/:id", (req, res) => {
  const id = Number(req.params.id)
  const contact = contacts.find(contact => contact.id === id)
  const index = contacts.indexOf(contact)

  const deletedContact = contacts.splice(index, 1)

  res.json({contact: deletedContact})
})



const port = 3030
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})