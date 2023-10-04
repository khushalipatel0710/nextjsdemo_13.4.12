// ** JWT import
import jwt from "jsonwebtoken";
import { User } from "../../../models/index";

const jwtConfig = {
  secret: "dd5f3089-40c3-403d-af14-d0c228b05cb4",
  expirationTime: "20d",
  refreshTokenSecret: "7c4c1c50-3230-45bf-9eae-c9b2e401c767",
};

export default async (config, res) => {
  const {
    method,
    body,
    query: { id },
  } = config;
  console.log(method);

  const token = config.headers.authorization;

  let response = [200, {}];

  jwt.verify(token, jwtConfig.secret, async (err, decoded) => {
    console.log(err, "err");

    if (err) {
      const oldTokenDecoded = jwt.decode(token, { complete: true });

      console.log(oldTokenDecoded, "kkp......");
      const { id: userId } = oldTokenDecoded.payload;
      console.log(id);
      if (!id) {
        response = [401, { error: { error: "Invalid User" } }];

        return response;
      }

      const user = await User.findOne({
        where: {
          id: userId,
          raw: true,
        },
      });
      console.log(user, "userdata me");

      const accessToken = jwt.sign({ id: userId }, jwtConfig.secret, {
        expiresIn: jwtConfig.expirationTime,
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", accessToken);
      } else {
        console.log("You are on the server,Cannot execute");
      }
      const obj = { userData: { ...user.data, password: undefined } };
      console.log(obj, "userdat me1");

      response = [200, obj];
      console.log(response, "userdat me2");

      return res.json(response);
    } else {
      const userId = decoded.id;

      const userData = await User.findOne({
        where: {
          id: userId,
        },
        raw: true,
      });

      console.log(userData);

      delete userData.password;

      response = [200, { userData }];

      return res.json(response);
    }
  });
  console.log(response, "KP");

  return res.response;
};
