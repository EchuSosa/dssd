const Bonita = require("../model/bonita");
const model = require("../database/models/Index");
const Protocol = require("./protocol.controller");

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getTokenLogin = async (req, res) => {
  try {
    const { username, password } = { ...req.body };
    const response = await Bonita.login(username, password);
    if (response && response.status) {
      //Acomodar el pasamanos del process definition
      let proccesessDefinitions = await Bonita.getProcessDefinitions();
      let proccesDefinition = proccesessDefinitions.find(
        (processDef) => processDef.name == "Laboratorio"
      );
      Bonita.setProcessDefinition(proccesDefinition.id);
      const currentUser = await Bonita.getUserId(username);
      const token = response.token;
      return res.status(200).json({ token, currentUser });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const createNewProject = async (req, res) => {
  try {
    const newProject = await Bonita.newProject();
    if (newProject) {
      model.Project.create({
        name: req.body.name,
        user_id: newProject.started_by,
        startDate: newProject.start,
        endDate: req.body.endDate
          ? new Date(req.body.endDate).toUTCString()
          : null,
        bonitaIdProject: newProject.id,
      }).catch((e) => console.log("Error", e));
      return res.status(200).json(newProject);
    } else {
      return res.status(400).json({});
    }
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const advanceTaskBack = async (req, res) => {
  try {
    const response = await Bonita.advanceTask(req.body.id);
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 * @param {*} req
 * @param {*} res
 */
const deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params
    console.log("llego al delete case del bonita controller con "+caseId)
    const response = await Bonita.deleteCase(caseId);
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 * @param {*} req
 * @param {*} res
 */
const restartProtocol = async (req, res) => {
  try {
    const { idProtocol } = req.body
    const response = await Protocol.restartProtocol(req,res);
    if (response) {
      return res.status(200).json({ status: "Protocol Restarted" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getProcessDefinitions = async (req, res) => {
  try {
    const response = await Bonita.getProcessDefinitions();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const createCase = async (req, res) => {
  try {
    const response = await Bonita.createCase();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getIdTask = async (req, res) => {
  try {
    const response = await Bonita.getIdTask();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


const getCasesByUser = async (req, res) => {
  try {
    arr = []
    var project;
    var params;
    const { idUser } = req.params;
    const response = await Bonita.getActiveCases(idUser);
    
    for(var key in response)
    {
      var id = response[key].id
      console.log("entro con el id "+id)
      project = await model.Project.findOne({
        where: { bonitaIdProject: id },
      });
      console.log("se trajo el proyecto"+project)
      if (!project) {
        status = 'iniciado'
        console.log("entro al fin porque no encontro proyecto")        
      }else{
        status = project.status
      }
      console.log("no entro al fin porque encontro proyecto, el estado es"+status)
      response[key]["currentState"] = status;
      arr.push(response[key])
    }
    /*
    const projects = await model.Project.findAll({
      where: { bonitaIdProject: arr },
    });*/
    if (response) {   
      return res.status(200).json({ response });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

const testAllFlow = async (req, res) => {
  try {
    const response = await Bonita.testAllFlow();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

const startActivity = async (req, res) => {
  try {
    const { parentCaseId, userId } = req.body;
    //const idActivity = await Bonita.getActivity(parentCaseId);
    //await Bonita.updateTask(idActivity[0].id);
    console.log("hasta el start activity del controller llego")
    const response = await Bonita.advanceTask(parentCaseId,userId);
    console.log("paso el await de advance task")
    if (response) {
      console.log("entro al if porque habia response en el startActivity")
      return res.status(200).json();
    }
    console.log("no entro al if porque no habia noresponse en el startActivity")
    return res.status(400).json({});
  } catch (e) {
    console.log("falla en startActivity", e);
    return res.status(403);
  }
};

const assignActivity = async (req, res) => {
  try {
    console.log("entro a asignar")
    const { parentCaseId } = req.body;
    const { userId } = req.body;
    
    console.log(" los datos que trajo para asignar"+parentCaseId+'/'+userId)
    const response = await Bonita.assignActivity(parentCaseId, userId);    
    console.log("paso el assing que le pega al modelo de bonita")
    if (response) {
      console.log("entro al if porque hay response")
      console.log(response)
      console.log("retornando....")
      return res.status(200).json();
    }
    return res.status(400).json({});
  } catch (e) {
    console.log("falla al asignar la actividad", e);
    return res.status(403);
  }
};

const getAllActiveCases = async (req, res) => {
  try {
    const response = await Bonita.getAllActiveCases();
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


/**
 * @fb
 */
const getGroupId = async (req, res) => {
  try {
    console.log("Llega a pedir el id");
    const id  = await Bonita.getGroupId();
    if (id) {
      return id[0].id;
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 */
const getAllUsers = async (req, res) => {
  try {
    const group_id = await getGroupId();
    console.log("el group id es "+group_id)
    const response = await Bonita.getAllUsers(group_id);
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 */
const getCurrentActivity = async (req, res) => {
  try {
    const { parentCaseId } = req.params
    const response = await Bonita.getActivity(parentCaseId);
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


module.exports = {
  getTokenLogin,
  advanceTaskBack,
  getProcessDefinitions,
  createCase,
  getIdTask,
  testAllFlow,
  createNewProject,
  getCasesByUser,
  startActivity,
  getAllActiveCases,
  getGroupId,
  getAllUsers,
  getCurrentActivity,
  assignActivity,
  deleteCase,
  restartProtocol
};

/*
Esto estaba antes de arrancar abría que borrarlo si no srive

const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require("constants");
const fetch = require("node-fetch");
const {URLSearchParams} = require('url');
const bonita = 'http://localhost:8080/bonita';

const getCookies = (res) => res.headers.get('set-cookie').split(', ');
const getCoookieValue = (cookie) => cookie.split('; ')[0].split('=')[1];
const getToken = (cookies) => getCoookieValue(cookies[2]);
const getSession = (cookies) => getCoookieValue(cookies[1]);
const getTenant = (cookies) => getCoookieValue(cookies[0]);

class Bonita {
    constructor(res) {
        let cookies = getCookies(res);
        this.tenant = getTenant(cookies);
        this.token = getToken(cookies);
        this.session = getSession(cookies);
        this.process = false
    }

    static get user() {
        return 'walter.bates'
    }

    static get pass() {
        return 'bpm'
    }

    get cookies() {
        return `bonita.tenant=${this.tenant}; BOS_Locale=es; JSESSIONID=${this.session}; X-Bonita-API-Token=${this.token}`
    }

    get headers() {
        return {Cookie: this.cookies, 'Content-Type': 'application/json', 'X-Bonita-API-Token': this.token}
    }

    static async login() {
        try{
        console.log("entro al login")

        let params = new URLSearchParams();
        params.append('username', Bonita.user);
        params.append('password', Bonita.pass);
        params.append('redirect', false);
        console.log("juju")
                                                // var jorge=
                                                // console.log(jorge.cookies)
                                                //   console.log(await jorge.getProcesses())
                                                // console.log(await jorge.getProcess('Pool'))
                                                //  console.log("Los casos que tenemos son: "+JSON.stringify(await jorge.getCases()))
                                                    //  console.log("a")
                                                //console.log(jorge.getUserTasks(20015) )
                                                //  console.log("b")
                                                // console.log(await jorge.getUserId())
                                                    //console.log(jorge.token)
                                                //var salida = await jorge.updateTask(20034)
        return await fetch(`${bonita}/loginservice`, {method: 'POST', body: params}).then(res => new Bonita(res))
        }catch(e){
            console.log(" entro al catch "+e)
        }
    }
    // if params.productid, will return an array of only one product
    // if params.token, price will change if token owner is an employee
    static async completeGetProjects(params = {}) {
        let variables = [];

        let bonita = await Bonita.login();

        await bonita.setProcess('Projects');

        if (params.token) variables.push({name: 'token', value: params.token});

        await bonita.newCase(variables);

        return bonita
    }

    static async completeSell(params = {}) {
        let variables = [];

        let bonita = await Bonita.login();

        await bonita.setProcess('Venta3');

        if (!params.productid || !params.quantity || !params.caseid) return false;

        variables.push({name: 'productid', value: params.productid});
        variables.push({name: 'quantity', value: params.quantity});
        variables.push({name: 'caseid', value: params.caseid});

        if (params.token) variables.push({name: 'token', value: params.token});
        if (params.coupon) variables.push({name: 'couponnum', value: params.coupon});

        await bonita.newCase(variables);

        return bonita
    }

    getProcesses() {
        return fetch(bonita + '/API/bpm/process?c=10&p=0', {headers: this.headers}).then(res => res.json())
    }

    getProcess(name) {
        return this.getProcesses().then(processes => processes.find(p => p.name === name))
    }
    async getUserId(){
        const variablita = await fetch(bonita + '/API/identity/user?f=userName=walter.bates', {headers: this.headers}).then(res => res.json())
        return variablita[0].id
    }
    async getCases() {
        return await fetch(bonita + '/API/bpm/case?p=0&c=10', {headers: this.headers}).then(res => res.json())
    }

    async getUserTasks(id) {
        return fetch(`${bonita}/API/bpm/humanTask/${id}`, {headers: this.headers}).then(res => res.json())
    }

    async updateTask(id) {
        var params = [{'state':'skipped'}]
        console.log(JSON.stringify(params[0]))
        try {
            return await fetch(`${bonita}/API/bpm/humanTask/${id}`, {
            headers: this.headers,
            method: 'PUT',
            body: JSON.stringify(params[0])
        }).then(res => res.json())
        }catch(e){
            return console.log("catchhhhhhhhhhhhh"+e)
        }


    }

    setProcess(name) {
        this.process = ( this.getProcess(name)).id
    }

    postCase(params) {
        return fetch(bonita + '/API/bpm/case', {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify({processDefinitionId: this.process, variables: params})
        }).then(res => res.json())
    }

    async newCase(params = []) {
        this.case = (await this.postCase(params)).id
    }
}


module.exports = Bonita;
*/
