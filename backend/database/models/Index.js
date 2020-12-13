const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const envConfigs = require("../config/config");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = envConfigs[env];
const db = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db["User"].belongsToMany(db["Role"], { as: "roles", through: "userRoles" });
db["Role"].belongsToMany(db["User"], { as: "users", through: "userRoles" });

sequelize.sync({ alter: true });

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
