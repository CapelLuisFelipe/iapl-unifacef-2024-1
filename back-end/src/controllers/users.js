import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import { uuidv7 } from 'uuidv7'
<<<<<<< HEAD
<<<<<<< HEAD
=======
import cryptr from '../lib/cryptr.js'
>>>>>>> parent of c392050 ((23/05) Término da lógica de gerenciamento de autenticação por sessão)
=======
import Cryptr from 'cryptr'
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239

const controller = {}

controller.create = async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12)
    await prisma.user.create({ data: req.body })
    res.status(201).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.user.findMany()
    for(let user of result) {
      if(user.password) delete user.password
    }
    res.send(result)
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })
    if(result.password) delete result.password
    if(result) res.send(result)
    else res.status(404).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  try {
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }
    const result = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
    if(result) res.status(204).end()
    else res.status(404).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.delete = async function(req, res) {
  try {
    const result = await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })
    if(result) res.status(204).end()
    else res.status(404).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.login = async function(req, res) {

  try {
    const user = await prisma.user.findUnique({
      where: { username: req.body.username }
    })
    if(!user) return res.status(401).end()
    const passwordMatches = await bcrypt.compare(req.body.password, user.password)
    if(!passwordMatches) return res.status(401).end()

<<<<<<< HEAD
    const sessid = uuidv7()
    await prisma.session.create({ data: { sessid, user_id: user.id } })

<<<<<<< HEAD
    res.cookie(process.env.AUTH_COOKIE_NAME, sessid, {
      httpOnly: true,
=======
    // Forma o cookie para enviar ao front-end
    // O sessid é incluído no cookie de forma criptografada
    res.cookie(process.env.AUTH_COOKIE_NAME, cryptr.encrypt(sessid), {
      httpOnly: true,   // O cookie ficará inacessível para JS no front-end
>>>>>>> parent of c392050 ((23/05) Término da lógica de gerenciamento de autenticação por sessão)
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    })
=======
    // Cria a sessão para o usuário autenticado
    const sessid = uuidv7()   // Geração de um UUID para a sessão
    await prisma.session.create({ data: { sessid, user_id: user.id } })

    // Forma o cookie para enviar ao front-end
    // O sessid é incluído no cookie de forma criptografada
    const cryptr = new Cryptr(process.env.TOKEN_SECRET)
    res.cookie(process.env.AUTH_COOKIE_NAME, cryptr.encrypt(sessid), {
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
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239

    res.status(204).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.me = function(req, res) {
<<<<<<< HEAD
  if(req.authUser) res.send(req.authUser)
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
  res.clearCookie(process.env.AUTH_COOKIE_NAME)
  res.status(204).end()
=======
  // Apaga o cookie que armazena o token de autorização
  res.clearCookie(process.env.AUTH_COOKIE_NAME)
  res.send(204).end()
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
}

export default controller
