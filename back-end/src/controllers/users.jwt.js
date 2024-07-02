import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

<<<<<<< HEAD
const controller = {}

controller.create = async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12)
    await prisma.user.create({ data: req.body })
    res.status(201).end()
  } catch (error) {
=======
const controller = {}     // Objeto vazio

controller.create = async function(req, res) {
  try {

    // Criptografando a senha
    req.body.password = await bcrypt.hash(req.body.password, 12)

    await prisma.user.create({ data: req.body })

    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.user.findMany()
<<<<<<< HEAD
    for (let user of result) {
      if (user.password) delete user.password
    }
    res.send(result)
  } catch (error) {
=======

    // Deleta o campo "password", para não ser enviado ao front-end
    for(let user of result) {
      if(user.password) delete user.password
    }

    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

<<<<<<< HEAD
controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (result.password) delete result.password
    if (result) res.send(result)
    else res.status(404).end()
  } catch (error) {
=======
controller.retrieveOne = async function (req, res) {
  try {
    const result = await prisma.user.findUnique({
      where: { id: Number(req.params.id)}
    })

    // Deleta o campo "password", para não ser enviado ao front-end
    if(result.password) delete result.password

    // Encontrou: retorna HTTP 200: OK (implícito)
    if(result) res.send(result)
    // Não encontrou: retorna HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

<<<<<<< HEAD
controller.update = async function(req, res) {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }
=======
controller.update = async function (req, res) {
  try {

    // Criptografando o campo password caso o valor tenha sido passado
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }

>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    const result = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
<<<<<<< HEAD
    if (result) res.status(204).end()
    else res.status(404).end()
  } catch (error) {
=======

    // Encontrou e atualizou ~> HTTP 204: No Content
    if(result) res.status(204).end()
    // Não encontrou (e não atualizou) ~> HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

<<<<<<< HEAD
controller.delete = async function(req, res) {
=======
controller.delete = async function (req, res) {
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
  try {
    const result = await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })
<<<<<<< HEAD
    if (result) res.status(204).end()
    else res.status(404).end()
  } catch (error) {
=======

    // Encontrou e excluiu ~> HTTP 204: No Content
    if(result) res.status(204).end()
    // Não encontrou (e não excluiu) ~> HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

controller.login = async function(req, res) {
<<<<<<< HEAD
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.body.username }
    })
    if (!user) return res.status(401).end()
    const passwordMatches = await bcrypt.compare(req.body.password, user.password)
    if (!passwordMatches) return res.status(401).end()

    const token = jwt.sign(
      user,
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie(process.env.AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(204).end()
  } catch (error) {
=======

  try {
    // Busca o usuário pelo username
    const user = await prisma.user.findUnique({
      where: { username: req.body.username }
    })
    // Se o usuário não for encontrado, retorna
    // HTTP 401: Unauthorized
    if(! user) return res.status(401).end()
    // Usuário encontrado, vamos conferir a senha
    const passwordMatches = await bcrypt.compare(req.body.password, user.password)
    // Se a senha não confere ~> HTTP 401: Unauthorized
    if(! passwordMatches) return res.status(401).end()

    // Formamos o token de autenticação para enviar ao front-end
    const token = jwt.sign(
      user,   // O token contém as informações do usuário logado
      process.env.TOKEN_SECRET,   // Senha de criptografia do token
      { expiresIn: '24h' }        // Prazo de validade do token
    )

    // Forma o cookie para enviar ao front-end
    res.cookie(process.env.AUTH_COOKIE_NAME, token, {
      httpOnly: true,   // O cookie ficará inacessível para JS no front-end
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000   // 24 horas
    })

    // Envia o token na resposta com código HTTP 200: OK (implícito)
    //res.send({token})

    // HTTP 204: No Content
    res.status(204).end()

  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
    res.status(500).end()
  }
}

controller.me = function(req, res) {
<<<<<<< HEAD
  if (req.authUser) res.send(req.authUser)
=======

  // Se o usuário autenticado estiver salvo em req,
  // retorna-o
  if(req.authUser) res.send(req.authUser)

  // Senão, retorna HTTP 401: Unauthorized
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
  else res.status(401).end()
}

controller.logout = function(req, res) {
<<<<<<< HEAD
=======
  // Apaga o cookie que armazena o token de autorização
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
  res.clearCookie(process.env.AUTH_COOKIE_NAME)
  res.send(204).end()
}

export default controller
