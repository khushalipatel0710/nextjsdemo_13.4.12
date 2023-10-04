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

apiRoute.delete(async (req, res) => {
  try {
    console.log("req.body", req.query);

    const deletedData = data.filter((a) => a.id != req.query.id);
    return res.status(200).json({ data: deletedData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }

});
export default apiRoute;
