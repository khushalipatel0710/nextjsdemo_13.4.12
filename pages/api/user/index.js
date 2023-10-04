import nextConnect from "next-connect";
import { User } from "../../../models/index";
import { paginateRequestParams, commonResponse } from "../../../lib/utils";
import common from "../../../static/static";
import { Op } from 'sequelize'

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

var response
apiRoute.post(async (req, res) => {
  let body = req.body.data;
  console.log("body",body);
  try {
    const checkUser = await User.findOne({
      where: {
        email: body.email,
      },
      raw: true,
    });
    if (checkUser) {
      const response = commonResponse(false, {}, "Email already used", {
        email: "Email already used",
      });

      return res
        .status(common.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    }

    const user = await User.create(body);
    response = commonResponse(true, user, "User created Successfully", null);

    return res.status(common.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
     return res
      .status(common.HTTP_RESPONSE.HTTP_NOT_FOUND)
      .json({ message: error.message });
  
  }
});
apiRoute.put(async (req, res) => {
  let reqBody = req.body.data;
  try {
    console.log("reqBody",reqBody);
    const checkUser = await User.findOne({
          where: {
            email: reqBody.email
          },
          raw: true
        })
        if (checkUser) {
          if (checkUser.id !== reqBody.id) {
            const response = commonResponse(false, {}, 'Email already used', {
              email: 'Email already used'
            })

            return res.status(common.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response)
          }
        }
      

        const user = await User.update(reqBody, {
          where: {
            id: reqBody.id
          }
        })
        const response = commonResponse(true, user, 'User updated Successfully', null)

        return res.status(common.HTTP_RESPONSE.HTTP_SUCCESS).json(response)
  } catch (error) {
    return res
      .status(common.HTTP_RESPONSE.HTTP_NOT_FOUND)
      .json({ message: error.message });
  }
  
});
apiRoute.get(async (req, res) => {
  try {
    console.log( req.query," req.query____________________");
    const query = req.query
    const { limit, page } = paginateRequestParams(query);
    delete query.page;
    delete query.limit;
    var queryValue = {
      email: { [Op.notIn]: ["admin@gmail.com"] },
    };
    const options = {
      page: Number(page), // Default 1
      paginate: Number(limit), // Default 25,
      where: queryValue,
      order: [["updatedAt", "DESC"]],
    };
    const users = await User.paginate(options);
    const response = commonResponse(
      true,
      users,
      "User fetched Successfully",
      null
    );

    return res.status(common.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(common.HTTP_RESPONSE.HTTP_NOT_FOUND)
      .json({ message: error.message });
  }
});

export default apiRoute;
