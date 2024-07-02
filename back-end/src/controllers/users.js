import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import { uuidv7 } from 'uuidv7'

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

    const sessid = uuidv7()
    await prisma.session.create({ data: { sessid, user_id: user.id } })

    res.cookie(process.env.AUTH_COOKIE_NAME, sessid, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    })

    res.status(204).end()
  } catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.me = function(req, res) {
  if(req.authUser) res.send(req.authUser)
  else res.status(401).end()
}

controller.logout = function(req, res) {
  res.clearCookie(process.env.AUTH_COOKIE_NAME)
  res.status(204).end()
}

export default controller
