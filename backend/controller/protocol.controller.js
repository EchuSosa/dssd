const { Pool } = require("pg");
const model = require("../database/models/Index");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { report } = require("../routes/index.routes");
const { Op } = require("sequelize");
const Bonita = require("../model/bonita");
const heroku = "https://dssd-2020-lab.herokuapp.com/";
const fetch = require("node-fetch");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const currentUser = (req) => {
  let token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, config.secret);
  var userId = decoded.id;
  return userId;
};

const userHasPermissions = (res, req, protocolUserId) => {
  if (currentUser(req) !== protocolUserId) {
    return res.status(403).send({
      message: "You don't have permission to do this action",
    });
  }
};

const protocolIsStarted = (res, startDate) => {
  if (startDate !== null) {
    return res.status(200).send({
      message: "Protocol is already started",
    });
  }
};

const protocolIsApproved = (res, endDate) => {
  if (endDate !== null) {
    return res.status(200).send({
      message: "Protocol is already approved",
    });
  }
};

/* este metodo solo funciona con el jwt activado
const getProtocols = async (req, res) => {
  try {
    const id = currentUser(req);
    const protocols = await model.Protocol.findAll({
      where: { user_id: id },
    });

    if (protocols.length === 0) {
      return res.status(200).send({
        message: "There are not protocols",
      });
    }

    return res.status(200).json({ protocols });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
*/

const getProtocols = async (req, res) => {
  try {
    const protocols = await model.Protocol.findAll();
    if (protocols.length === 0) {
      return res.status(200).send({
        message: "There are not protocols",
      });
    }

    return res.status(200).json({ protocols });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getNextProtocol = async (req, res) => {
  try {
    const { idProject, current } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { [Op.and]: [{ started: false }, { project_id: idProject }, { order: current }] }
    });
    if (protocol) {
      return res.status(200).json({ protocol });
    }
    return res
      .status(404)
      .send("Protocol with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getProtocolById = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { id: id },
    });

    //userHasPermissions(res, req, protocol.dataValues.user_id);

    if (protocol) {
      return res.status(200).json({ protocol });
    }
    return res
      .status(404)
      .send("Protocol with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getProtocolsByProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findAll({
      where: { project_id: id },
    });

    //userHasPermissions(res, req, protocol.dataValues.user_id);

    if (protocol) {
      return res.status(200).json({ protocol });
    }
    return res
      .status(404)
      .send("Protocol with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const executeRemoteProtocol = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("**********************  *******************bonita le pego con este id-> " + id)
    console.log("paso el atre de bonita")
    console.log("con esta cosa " + JSON.stringify(req.body))
    const score = Math.floor(Math.random() * 11);
    console.log("el score random que trae es "+score)
    const protocol = await model.Protocol.update(
      { endDate: Date.now(), score: score, executed: true },
      { where: { id: id } });
    return res.status(200).json({ protocol });
    /*
    const protocol = await model.Protocol.create(req.body);
    return res.status(201).json({
      protocol,
    });*/
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createRemoteProtocol = async (req, res) => {
  try {
    const protocol = await model.Protocol.create(req.body);
    return res.status(201).json({ protocol });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getRemoteValue = async (req, res) => {
  try { //hacer que heroku me devuelva el protocolo con el id local
    const { id } = req.params
    var url = heroku + 'remote/protocol/' + id
    var  response  = await fetch(url)
      .then(async (res) => { return await res.json() });
    var protocol=response.protocol
    console.log(JSON.stringify("UPDATEO EN HEROKU Y TRAJO-> "+JSON.stringify(protocol)))
    var params = [{"score":protocol.score, "executed":true}];
    protocol = await model.Protocol.update(params[0],{  where: { id: id } }   );
    return res.status(500).json({ protocol });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createProtocol = async (req, res) => {
  try {
    if (req.body.isLocal == 1) {
      console.log("no entro para pegarle a hrokuuuuuuuuuuuuuuuuuuuuuuuuuu--------------")
      const protocol = await model.Protocol.create(req.body);
      return res.status(201).json({ protocol });
    } else {

      console.log("entro para pegarle a hrokuuuuuuuuuuuuuuuuuuuuuuuuuu--------------")
      var url = heroku + 'remote/protocols'
      console.log("la url es " + url)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      })
        .then(async (res) => { return await res.json() });

      //creando protocolo en el local
      remoteId = response.protocol.id
      req.body['remoteId'] = remoteId
      var protocol = await model.Protocol.create(req.body);


      //seteando el local id
      var localId = protocol.id
      const params = [{ "localId": localId, "executed": true, "started": true }]
      url = heroku + 'protocols/' + remoteId
      protocol = await fetch(url, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params[0])
      })
        .then(async (res) => { return await res.json() });
      console.log(JSON.stringify("UPDATEO EN HEROKU Y TRAJO-> "+JSON.stringify(protocol)))
      return res.status(201).json(protocol)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const updateProtocol = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { id: id },
    });

    //userHasPermissions(res, req, protocol.dataValues.user_id);

    const [updated] = await model.Protocol.update(req.body, {
      where: { id: protocol.id },
    });

    if (updated) {
      const updatedProtocol = await model.Protocol.findOne({
        where: { id: id },
      });
      return res.status(200).json({ protocol: updatedProtocol });
    }
    throw new Error("Protocol not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const restartProtocol = async (req, res) => {
  try {
    const { idProtocol } = req.params;
    var params = [{"score":null, "executed":false}];
    var protocol = await model.Protocol.update(params[0],{  where: { id: idProtocol } }   );   
    console.log("imprimer este proto"+protocol)
    if (protocol) {
      var updatedProtocol = await model.Protocol.findOne({
        where: { id: idProtocol },
      });

      //lo vuelvo a encolar
      const caseId = updatedProtocol.project_id
      const lastOrder = await model.Protocol.max('order', {where : {'project_id': caseId }})
      console.log("el last order es "+lastOrder)
      params = [{"order":parseInt(lastOrder,10)+1}];
      protocol = await model.Protocol.update(params[0],{  where: { id: idProtocol } }   );   
      if (protocol) {
        updatedProtocol = await model.Protocol.findOne({
          where: { id: idProtocol },
        });
        return res.status(200).json({ protocol: updatedProtocol });
      }
      
    }
    throw new Error("Protocol not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const deleteProtocol = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { id: id },
    });

    userHasPermissions(res, req, protocol.dataValues.user_id);

    const deleted = await model.Protocol.destroy({
      where: { id: protocol.id },
    });

    if (deleted) {
      return res.status(204).send("Protocol deleted");
    }
    throw new Error("Protocol not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const startProtocol = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { id: id },
    });

    userHasPermissions(res, req, protocol.dataValues.user_id);
    protocolIsStarted(res, protocol.dataValues.startDate);

    protocol.update({ startDate: Date.now(), staterd: true });

    return res.status(200).send({
      message: "Protocol has been started",
    });

    throw new Error("Protocol not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

/*const approveProtocol = async (req, res) => {
  try {
    const { id } = req.params;
    const protocol = await model.Protocol.findOne({
      where: { id: id },
    });

    if (protocol) {
      userHasPermissions(res, req, protocol.dataValues.user_id);
    } else {
      return res.status(500).send({
        message: "Protocol not found",
      });
    }

    if (protocol.dataValues.startDate === null) {
      return res.status(400).send({
        message: "The protocol needs to be start before approve",
      });
    }

    protocolIsApproved(res, protocol.dataValues.endDate);
    const score = req.body.score;
    if (!(score >= 0 && score <= 10)) {
      return res.status(400).send({
        message: "Score must be a value between 0 and 10",
      });
    } else {
      await protocol.update({ endDate: Date.now(), score: req.body.score });
      return res.status(200).send({
        message: "Protocol has been approved",
      });
    }

    throw new Error("Protocol not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
*/
const getStatus = async (req, res) => {
  const { projectId } = req.body;
  console.log("entro al getStatus controller con el id " + projectId)
  return await Bonita.getStatus(projectId)
}

const approveProtocol = async (req, res) => {
  const { id, score, projectId, userId } = req.body;
  console.log("lo que llega al controlador de approve es: " + JSON.stringify(req.body))

  const response = await model.Protocol.update(
    { endDate: Date.now(), score: score, executed: true },
    { where: { id: id } });

  console.log("la response en el controlador de proto despues de updatear es" + JSON.stringify(response))

  if (response) {
    console.log("entro al if porque hay response en el approve")
    //const protocolos = await getProtocolsByProjectId(projectId)
    //cuento los que faltan
    const cant = await model.Protocol.count({
      where: {
        [Op.and]: [{ project_id: projectId.toString() }, { executed: false }]
      }
    });

    console.log("la cuenta de los que faltan devolvio " + cant)

    if (cant == 0) {
      console.log("entro al IF porque la cantidad que queda es 0")
      console.log("el project id y user es:" + projectId + userId)
      //aca pongo la logica para setear si quedan protos    
      const decision = "terminar"
      await Bonita.setDecision(projectId, decision)
      await Bonita.advanceTask(projectId, userId)
      console.log("era el ultimo ")

    } else {
      console.log("entro al porque la cantidad que queda es MAYOR A 0")
      console.log("el project id y user es:" + projectId + userId)
      await Bonita.assignActivity(projectId, userId)
      console.log("paso el assign activity llamado del controller")
      const decision = "continuar"
      await Bonita.setDecision(projectId, decision)
      console.log("paso el set decision llamado del controller")
      await Bonita.advanceTask(projectId, userId)
      console.log("paso el advance task ")

    }
    return res.status(200).json(response);
  }
  return res.status(400).json({});
};

const getProtocolsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const protocols = await model.Protocol.findAll({
      where: { [Op.and]: [{ user_id: userId }, { started: true }] },
    });
    if (protocols) {
      return res.status(200).json(protocols);
    }
    return res.status(404);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getProtocolsByProjectId = async (req, res) => {
  try {
    console.log("aca paso")
    const { projectId } = req.params;
    const cant = await model.Protocol.count({
      where: {
        [Op.and]: [{ project_id: projectId }, { started: false }]
      }
    });
    console.log(cant)
    return cant
  } catch (error) {
    return res.status(500).send("catchhhhhhhhhh" + error.message);
  }
};

module.exports = {
  getProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  startProtocol,
  approveProtocol,
  getProtocolsByProjects,
  getProtocolsByUser,
  getProtocolsByProjectId,
  getNextProtocol,
  getStatus,
  executeRemoteProtocol,
  createRemoteProtocol,
  getRemoteValue,
  restartProtocol
};
