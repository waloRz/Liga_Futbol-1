const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const figlet = require('figlet')
const asciify = require('asciify-image')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

const credentials = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'ligabd'
}

app.get('/', (req, res) => {
	res.send('Hola Samus, soy el servidor!')
})

app.post('/api/login', (req, res) => {
	const { username, password } = req.body
	const values = [username, password]
	var connection = mysql.createConnection(credentials)
	connection.query("SELECT * FROM login WHERE username = ? AND password = ?", values, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			if (result.length > 0) {
				res.status(200).send({
					"id": result[0].id,
					"user": result[0].user,
					"username": result[0].username,
					"picture": result[0].picture,
					"isAuth": true
				})
			} else {
				res.status(400).send('Usuario no existe')
			}
		}
	})
	connection.end()
})

app.get('/api/usuarios', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * FROM usuarios', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
})

app.post('/api/eliminar', (req, res) => {
	const { id } = req.body
	var connection = mysql.createConnection(credentials)
	connection.query('DELETE FROM usuarios WHERE id = ?', id, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario Eliminado" })
		}
	})
	connection.end()
})

app.post('/api/guardar', (req, res) => {
	const { avatar, nombre, planeta } = req.body
	const params = [[avatar, nombre, planeta]]
	var connection = mysql.createConnection(credentials)
	connection.query('INSERT INTO usuarios (avatar, nombre, planeta) VALUES ?', [params], (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario creado" })
		}
	})
	connection.end()
})

app.post('/api/editar', (req, res) => {
	const { id,  avatar, nombre, planeta } = req.body
	const params = [avatar, nombre, planeta, id]
	var connection = mysql.createConnection(credentials)
	connection.query('UPDATE usuarios set avatar = ?, nombre = ?, planeta = ? WHERE id = ?', params, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "USuario editado" })
		}
	})
	connection.end()
})

//**********************EQUIPOS****************
app.post('/api/editarEq', (req, res) => {
	const { id, nombreEq,  delegado, celular,  idCategoria } = req.body
	const params = [ idCategoria, nombreEq, delegado, celular, id]
	var connection = mysql.createConnection(credentials)
	connection.query('UPDATE equipos SET idCategoria = ?, nombreEq = ?, delegado = ?, celular = ?  WHERE idEquipo = ?', params, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Equipo editado" })			
		}
	})
	connection.end()
})

app.get('/api/equipos', (req, res) => {
	var connection = mysql.createConnection(credentials)
	const consulta = "SELECT E.idEquipo AS id, E.nombreEq, E.delegado, E.celular, C.nombreCat AS Categoria, E.idCategoria FROM equipos E, categorias C WHERE E.idCategoria = C.idCategorias"
	connection.query(consulta, (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
	connection.end()
})

app.get('/api/eqCategoria', (req, res) => {
	var connection = mysql.createConnection(credentials)
	const consulta = 'SELECT * FROM categorias'
	connection.query(consulta, (err, rows) => {
		if (err) {
			res.status(500).send(err)			
		} else {
			res.status(200).send(rows)			
		}
	})
	connection.end()
})

app.post('/api/guardarEquipo', (req, res) => {
	const { nombreEq, delegado, celular, idCategoria } = req.body
	const params = [[ nombreEq, delegado, celular, idCategoria]]
	var connection = mysql.createConnection(credentials)
	connection.query('INSERT INTO equipos (nombreEq, delegado, celular, idCategoria) VALUES ?', [params], (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Equipo creado" })
		}
	})
	connection.end()
})



app.post('/api/eliminarEquipo', (req, res) => {
	const { id } = req.body
	var connection = mysql.createConnection(credentials)
	connection.query('DELETE FROM equipos WHERE idEquipo = ?', id, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Equipo Eliminado" })
		}
	})
	connection.end()
})

app.listen(4000, async () => {
	const ascified = await asciify('helmet.png', { fit: 'box', width: 10, height: 10 })
	console.log(ascified)
	console.log(figlet.textSync('Samus Server v. 1.0.0'))
})