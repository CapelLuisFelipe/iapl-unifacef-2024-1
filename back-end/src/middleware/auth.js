<<<<<<< HEAD
import prisma from '../database/client.js'

export default async function(req, res, next) {
=======
import cryptr from '../lib/cryptr.js'
import prisma from '../database/client.js'

export default function(req, res, next) {

  // As rotas que eventualmente não necessitarem
  // de autenticação devem ser colocadas no
  // objeto abaixo
>>>>>>> parent of c392050 ((23/05) Término da lógica de gerenciamento de autenticação por sessão)
  const bypassRoutes = [
    { url: '/users/login', method: 'POST' },
    { url: '/users', method: 'POST' }
  ]

  for(let route of bypassRoutes) {
    if(route.url === req.url && route.method === req.method) {
      console.log(`Rota ${route.url}, método ${route.method} não autenticados por exceção`)
      next()
      return
    }
  }

  let sessid = req.cookies[process.env.AUTH_COOKIE_NAME]

  if(!sessid) {
    const authHeader = req.headers['authorization']
    if(!authHeader) {
      console.error('ERRO: não autenticado por falta de cookie ou cabeçalho de autorização')
      return res.status(403).end()
    }

    const [ , _sessid] = authHeader.split(' ')
    sessid = _sessid
  }

<<<<<<< HEAD
  let session
  try {
    session = await prisma.session.findUniqueOrThrow({
      where: { sessid },
      include: { user: true }
=======
  // VALIDA A SESSSID
  let sessid
  
  // Tenta descriptografar a sessid
  try {
    sessid = cryptr.decrypt(cryptoSessid)
  }
  catch {
    // Caso ocorra algum erro com a decriptografia da sessid,
    // enviamos HTTP 403: Forbidden
    console.error('ERRO: não autenticado por falha na decodificação da sessid')
    return res.status(403).end()
  }

  // Buscamos as informações da sessão no banco de dados
  let session
  try {
    session = prisma.session.findUniqueOrThrow({
      where: { sessid }
>>>>>>> parent of c392050 ((23/05) Término da lógica de gerenciamento de autenticação por sessão)
    })
  } catch {
    console.error('ERRO: não autenticado por erro na recuperação das informações da sessão')
    return res.status(403).end()
  }

<<<<<<< HEAD
  const now = new Date()
  if(now.getTime() - session.start_time.getTime() > Number(process.env.SESSION_DURATION)) {
    console.error('ERRO: não autenticado por sessão expirada.')
    return res.status(403).end()
  }

  if(session.user?.password) delete session.user?.password
  req.authUser = session.user

  next()
}
=======
  // Valida o token
  // jwt.verify(cryptoSessid, process.env.TOKEN_SECRET, (error, user) => {

  //   // Token inválido ou expirado
  //   // HTTP 403: Forbidden
  //   if(error) {
  //     console.error('ERRO: token inválido ou expirado')
  //     return res.status(403).end()
  //   }

  //   /*
  //     Se chegamos até aqui, o token está OK e temos as informações
  //     do usuário logado no parâmetro 'user'. Vamos guardá-lo no 'req'
  //     para futura utilização
  //   */
  //   req.authUser = user
    
  //   // Continua para a rota normal
  //   next()
  // })

}
>>>>>>> parent of c392050 ((23/05) Término da lógica de gerenciamento de autenticação por sessão)
