const { Pool } = require("pg");
const model = require("../database/models/Index");
var bcrypt = require("bcryptjs");


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getUsers = async (req, res) => {
  try {
    const users = await model.User.findAll();
    return res.status(200).json({ users });
  
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await model.User.findOne({
      where: { id: id }     
    });
    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).send("User with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await model.User.create({
      username: req.body.username,
      email: req.body.email,
      name:req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      createdAt:new Date(),
    });

    return res.status(201).json({
      user
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [ updated ] = await model.User.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedUser = await model.User.findOne({ where: { id: id } });
      return res.status(200).json({ user: updatedUser });
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await model.User.destroy({
      where: { id: id }
    });
    if (deleted) {
      return res.status(204).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
}
const userBoard = (req, res) => {
  res.status(200).send("User Content.");
}

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
}

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  
}