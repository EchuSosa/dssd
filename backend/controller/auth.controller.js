const { Pool } = require("pg");
const model = require("../database/models/Index");
const config = require("../config/auth.config");

const {  createUser } = require("./user.controller");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const Op = model.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  // Save User to Database
  await model.User.create({
    id:req.body.id,
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8),
    createdAt: new Date(), updatedAt: new Date()
  })
    .then(async user => {
      if (req.body.roles) {
        await model.Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
          
        }).then(async roles => {

          await user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        await user.setRoles(2).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message:"Error", err});
    });
};



const signin = async (req, res) => {
    model.User.findOne({
    where: {
      username: req.body.username
    },
  }).then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = []; 
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
      });
      
    })
    
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

  }

module.exports = {
    signup,
    signin    
  };