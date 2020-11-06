const express = require('express')
const dataStore = require('nedb')

const app = express()

const dataBase = new dataStore('database.db', { autoload: true })
dataBase.loadDatabase()

app.listen(process.env.PORT || 3000, () => {
	console.log('Listening')
})

app.use(express.static('public'))
app.use(express.json({ limit: '100kb' }))

app.post('/name', (request, response) => {
	const data = request.body
	console.log(data)
	dataBase.find({ name: data.name }, (err, docs) => {
		if (docs.length) {
			dataBase.update({ name: data.name }, { $inc: { matches: 1 } })
			dataBase.loadDatabase()
			console.log('Updated!')
		} else {
			dataBase.insert(data)
			console.log('Inserted!')
		}
	})
	response.end()
	//response.json({ status: "Success" });
})

app.get('/name', (request, response) => {
	dataBase
		.find({})
		.sort({ matches: -1 })
		.exec((err, data) => {
			if (err) {
				response.end()
				return
			}
			response.json(data)
		})
})
