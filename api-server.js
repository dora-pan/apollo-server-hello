const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api/list", (req, res) => {
  const name = req.query.name;
  const random = Math.floor(Math.random() * 1000);
  res.status(200).json({
    code: 0,
    message: "successfully.",
    result: [
      {
        id: random,
        name: "高山",
        mobile: "18657138904",
        branch: {
          id: 4001001,
          name: "杭州一部",
          address: "杭州",
        },
      },
      {
        id: random + 1,
        name: "高山风",
        mobile: "18657138901",
        branch: {
          id: 4001002,
          name: "广州一部",
          address: "广州",
        },
      },
      {
        id: random + 2,
        name: "高山松",
        mobile: "18657138902",
        branch: {
          id: 4001003,
          name: "上海一部",
          address: "上海",
        },
      },
      {
        id: random + 3,
        name: "严高山",
        mobile: "18657138903",
        branch: {
          id: 4001004,
          name: "北京一部",
          address: "北京",
        },
      },
      {
        id: random + 4,
        name: "钟高山",
        mobile: "18657138904",
        branch: {
          id: 4001004,
          name: "深圳一部",
          address: "深圳",
        },
      },
    ],
  });
});

app.use("/api/add", (req, res, next) => {
  const { id, name, mobile } = req.body;
  const random = Math.floor(Math.random() * 1000);
  res.status(200).json({
    code: 0,
    message: "successfully",
    result: {
      id,
      name: name + random,
      mobile,
    },
  });
});

app.get("/api/:id", (req, res, next) => {
  const random = Math.floor(Math.random() * 1000);
  res.status(200).json({
    id: req.params.id,
    name: "高山" + random,
    mobile: "18657138904",
    branch: {
      id: 4001001,
      name: "杭州一部",
      address: "杭州",
    },
  });
});

app.listen(5000, () => {
  console.log("APIServer ready at http://localhost:5000...");
});
