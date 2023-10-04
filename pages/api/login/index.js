
import nextConnect from 'next-connect';


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
    console.log("body",body);
    if (body.data.username == "spiral" && body.data.password == "admin@123") {
     return res.status(200).json({data:true})
    } else {
     return res.status(200).json({data:false})
   }

  } catch (error) {
    console.log(error)
      return res.status(400).json({data:false})
  }

})

export default apiRoute