
import nextConnect from 'next-connect';
import { User } from '../../../models/index'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

const _ = require('underscore')

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }
})

apiRoute.post(async (req, res) => {
  let body = req.body
     try {
        const { password, username } = body

        const user = await User.findAll({
          where: {
            password: password,
            [Op.or]: [{ email: username }, { username: username }]
          },

          raw: true
        })
        if (_.isEmpty(user)) {
          return res.status(400).json({ message: 'Invalid email or password' })
        }

        // if active and inactive then
        if (user[0].user_type == 'admin') {
          console.log(user, 'user')
          const accessToken = jwt.sign({ id: user[0].id },"dd5f3089-40c3-403d-af14-d0c228b05cb4" , { expiresIn: "20d" })

          const response = {
            accessToken,
            userData: { ...user[0], password: undefined }
          }

          return res.json(response)
        } else if (user[0].user_type == 'user') return res.status(400).json({ message: 'You are not admin' })
        else {
          return res.status(400).json({ message: 'You have not set passowrd' })
        }

        // return res.json(response.rows)
      } catch (error) {
        console.log('error................', error)

        return res.status(400).json({ message: error.message })
      }

})

export default apiRoute