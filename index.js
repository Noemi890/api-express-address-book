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

  const contactsWithMeetings = contacts.map(contact => {
    return {
      ...contact,
      meeting: meetings.filter(meeting => meeting.contactId === contact.id)
    }
  })

  res.json({
    contacts: contactsWithMeetings
  })
})

app.get("/contacts/:id", (req, res) => {

  const id = Number(req.params.id)

  const contact = contacts.find(contact => contact.id === id)
  
  res.json({contact})
})

app.get("/contacts/:id/meetings", (req, res) => {
  const id = Number(req.params.id)

  const filteredMeetings = meetings.filter(meet => meet.contactId === id)

  res.json({meetings: filteredMeetings})
})

app.get("/meetings", (req, res) => {
  res.json(meetings)
})

app.put("/contacts/:id", (req, res) => {
  const modifiedContact = req.body
  const id = Number(req.params.id)
  modifiedContact.id = id

  const contact = contacts.find(contact => contact.id === id)
  const index = contacts.indexOf(contact)

  contacts.splice(index, 1, modifiedContact)

  res.status(201).json({
    contact: {...modifiedContact}, 
    meetings: meetings.filter(meeting => meeting.contactId === modifiedContact.id)
  }) // modified after review
})

app.put("/contacts/:id/meetings/:meetingId", (req, res) => {
  const idMeeting = Number(req.params.meetingId)
  const newMeeting = req.body
  console.log(idMeeting, newMeeting)

  const foundMeeting = meetings.find(m => m.id === idMeeting)
  console.log(foundMeeting)
  const index = meetings.indexOf(foundMeeting)

  newMeeting.contactId = foundMeeting.contactId
  newMeeting.id = foundMeeting.id

  meetings.splice(index, 1, newMeeting)

  res.status(201).json({meetings: {...newMeeting}})
})

app.post("/contacts", (req, res) => {
  const contact = req.body
  contact.id = contacts.length + 1
  contacts.push(contact)

  console.log(contacts)

  res.status(201).json({contact, meetings:[]}) //modified after review
})

app.post("/contacts/:id/meetings", (req, res) => {
  const id = Number(req.params.id)
  const newMeeting = req.body

  newMeeting.id = meetings.length +1
  newMeeting.contactId = id

  meetings.push(newMeeting)
  console.log(meetings)

  res.json({meeting: newMeeting})
})

app.post("/meetings", (req, res) => {
  const newMeeting = req.body
  newMeeting.id = meetings.length+1

  meetings.push(newMeeting)

  res.json({meeting: newMeeting})
})

app.delete("/contacts/:id", (req, res) => {
  const id = Number(req.params.id)
  const contact = contacts.find(contact => contact.id === id)
  const index = contacts.indexOf(contact)

  const deletedContact = contacts.splice(index, 1)
  const contactMeetings = meetings.filter(meeting => meeting.contactId === contact.id)


  res.json({
    contact: deletedContact,
    meetings: contactMeetings // modified after review
  })
})



const port = 3030
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

