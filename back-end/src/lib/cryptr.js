import Cryptr from 'cryptr'

// Cria um novo encriptador que usarará a senha
// contida na variável de ambiente TOKEN_SECRET
<<<<<<< HEAD
const cryptr = new Cryptr(process.env.TOKEN_SECRET)

export default cryptr
=======
const secretKey = process.env.TOKEN_SECRET
const cryptr = new Cryptr(secretKey)

export default cryptr
>>>>>>> 6be394e31063691134cd8227352e2a951ca55239
