import nextConnect from "next-connect";
import { User } from "../../../models/index";
import {  commonResponse } from "../../../lib/utils";
import common from "../../../static/static";
const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.delete(async (req, res) => {
  try {
    console.log("req.body", req.query);

   const user = await User.destroy({
          where: {
            id: req.query.id
          }
        })
        const response = commonResponse(true, user, 'User delete Successfully', null)

        return res.status(common.HTTP_RESPONSE.HTTP_SUCCESS).json(response)
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }

});

export default apiRoute;
