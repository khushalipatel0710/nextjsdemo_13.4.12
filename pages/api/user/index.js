import nextConnect from "next-connect";

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

const data = [
  {
    id: 1,
    name: "khushali",
    age: 22,
    city: "supedi",
    gender: "female",
  },
  {
    id: 2,
    name: "swati",
    age: 28,
    city: "rajkot",
    gender: "female",
  },
  {
    id: 3,
    name: "hardi",
    age: 22,
    city: "Ahmedabad",
    gender: "female",
  },
];
apiRoute.post(async (req, res) => {
  let body = req.body;
  try {
    console.log("body_________________", body);
    // body.id = data.length + 1
    data.push(body);
    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
  }
});
apiRoute.put(async (req, res) => {
  let body = req.body;
  try {
    console.log("body_________________", body);
    const updatedData = data.map((a) => {
      if (a.id == body.id) {
        (a.name = body.name),
          (a.city = body.city),
          (a.gender = body.gender),
          (a.status = body.status),
          (a.age = body.age);
      }
      return a;
    });
    return res.status(200).json({ data: updatedData });
  } catch (error) {
    console.log(error);
  }
});
apiRoute.get(async (req, res) => {
  try {
    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

export default apiRoute;
