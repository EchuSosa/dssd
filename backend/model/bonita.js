const model = require('../database/models/Index')
const { Op } = require("sequelize");
const ResposeProcess = require("../dtos/dto-res-process-def");
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require("constants");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const bonita = "http://localhost:8080/bonita";
const getCookies = (res) => res.headers.get("set-cookie").split(", ");
const getCoookieValue = (cookie) => cookie.split("; ")[0].split("=")[1];
const getToken = (cookies) => getCoookieValue(cookies[2]);
const getSession = (cookies) => getCoookieValue(cookies[1]);
const getTenant = (cookies) => getCoookieValue(cookies[0]);
const PREFIX = "[BONITA]";
const METHOD = {
  POST: "POST",
  GET: "GET",
};

const CONTENT_TYPE = {
  JSON: "application/json",
};

class Bonita {
  constructor() {
    this.processDefinition = null;
  }

  init(res) {
    let cookies = getCookies(res);
    this.tenant = getTenant(cookies);
    this.token = getToken(cookies);
    this.session = getSession(cookies);
    this.process = false;
  }

  get cookies() {
    return `bonita.tenant=${this.tenant}; BOS_Locale=es; JSESSIONID=${this.session}; X-Bonita-API-Token=${this.token}`;
  }

  get headers() {
    return {
      Cookie: this.cookies,
      "Content-Type": CONTENT_TYPE.JSON,
      "X-Bonita-API-Token": this.token,
    };
  }

  setProcessDefinition(processDefinitionId) {
    this.processDefinition = processDefinitionId;
  }

  async getUserId(username) {
    return await fetch(`${bonita}/API/identity/user?f=userName=${username}`, {
      headers: this.headers,
    }).then((res) => res.json());
  }

  /**
   * @echu
   * @param {*} username
   * @param {*} password
   */
  async login(username, password) {
    try {
      let params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      params.append("redirect", false);
      return await fetch(`${bonita}/loginservice`, {
        method: METHOD.POST,
        body: params,
      }).then((res) => {
        this.init(res);
        return res.ok ? { status: true, token: this.token } : { status: false };
      });
    } catch (e) {
      console.log("Error en login", e);
    }
    return false;
  }

  /**
   * @echu
   * @param {*} id
   */
  async customUserInfo(id) {
    return await fetch(
      `${bonita}/API/customuserinfo/user?c=10&p=0&f=userId=${id}`,
      { headers: this.headers }
    ).then((res) => res.json());
  }

  /**
   * @echu
   * @param {*} id
   * Para hacer que una tarea avance
   */

  async advanceTask2(parentCaseId) {
    var params = [{ 'state': 'completed' }]
    try {
      return await fetch(`${bonita}/API/bpm/humanTask/?f=parentCaseId=${parentCaseId}`, {
        headers: this.headers,
        method: 'PUT',
        body: JSON.stringify(params[0])
      }).then(res => res.json())
    } catch (e) {
      return console.log("catchhhhhhhhhhhhh" + e)
    }


  }

  async updateTask(id) {
    try {
      return await fetch(`${bonita}/API/bpm/activity/${id}`, {
        headers: this.headers,
        method: "PUT",
        json: [{ state: "completed" }],
      }).then((res) => res.json());
    } catch (e) {
      return console.log("catch" + e);
    }
  }

  /**
   * @echu
   * Obtenemos todos los procesos de bonita
   */
  async getProcessDefinitions() {
    return await fetch(`${bonita}/API/bpm/process?c=10&p=0`, {
      method: METHOD.GET,
      headers: this.headers,
    })
      .then((res) => res.json())
      .catch((e) => {
        return false;
      });
  }

  /**
   * @echu
   * Creamos un caso con un process definition
   */
  async createCase() {
    try {
      const response = await fetch(`${bonita}/API/bpm/case`, {
        method: METHOD.POST,
        body: JSON.stringify({ processDefinitionId: this.processDefinition }),
        headers: this.headers,
      }).then((res) => res.json());
      return response;
    } catch (e) {
      console.log("Error en createCase", e);
    }
  }

  /**
   * @echu
   * Obtenemos el id de la tarea
   */
  async getIdTask(processId) {
    return await fetch(
      `${bonita}/API/bpm/task?c=10&p=0&f=processId=${processId}&o=state`,
      {
        method: METHOD.GET,
        headers: this.headers,
      }
    ).then((res) => res.json());
  }


  /**
 * @fb
 * Obtenemos el id del grupo
 */
  async getGroupId() {
    return await fetch(bonita + '/API/identity/group?p=0&c=100&f=name=Grupo 1',
      { headers: this.headers }).then(res => res.json())
  }


  /**
   * @fb
   * Obtenemos el id del grupo
   */
  async getAllUsers2(group_id) {
    return await fetch(
      `${bonita}/API/identity/user?p=0&c=5&o=lastname ASC&f=enabled=true&f=group_id=${group_id}`,
      {
        method: METHOD.GET,
        headers: this.headers,
      }
    ).then((res) => res.json());
  }

  /**
 * @fb
 * Obtenemos el id del grupo
 */
  async getAllUsers(group_id) {
    try {
      return await fetch(bonita + '/API/identity/user?p=0&c=5&o=lastname ASC&f=enabled=true&f=group_id=' + group_id,
        { headers: this.headers }).then(res => res.json())
    } catch (e) {
      console.log("Falla al crear un proyecto" + e);
    }
  }

  /**
* @fb
* Obtenemos el id del grupo
*/
  async getActiveCases(userId) {
    const response = await fetch(
      `${bonita}/API/bpm/case?p=0&c=10&f=userId=${userId}`,
      {
        method: METHOD.GET,
        headers: this.headers,
      }
    ).then((res) => res.json());

    return response;
  }

  async getAllActiveCases() {
    //TODO arreglar esto porque da un error la request
    try {
      const response = await fetch(
        `${bonita}/API/bpm/case?p=0&c=10&f=processName=Laboratorio`,
        {
          method: METHOD.GET,
          headers: this.headers,
        }
      ).then((res) => res.json());
      return response;
    } catch (e) { console.log(e) }
  }

  async newProject() {
    const newCase = await this.createCase();
    if (newCase) {
      return newCase;
    } else {
      console.log("Falla al crear un proyecto");
    }
  }

  /**
 * @fb
 * Obtenemos el id del grupo
 */
  async getCurrentTaskId(parentCaseId) {
    const response = await fetch(bonita + '/API/bpm/humanTask?p=0&c=10&f=parentCaseId=' + parentCaseId,
      { headers: this.headers }).then(res => res.json())
    return response[0].id;
  }

  async getActivity(parentCaseId) {
    try {
      const response = await fetch(bonita + '/API/bpm/humanTask?p=0&c=10&f=parentCaseId=' + parentCaseId, { headers: this.headers }
      ).then((res) => res.json());
      return response;
    } catch (e) { console.log(e) }
  }

  async assignActivity(parentCaseId, userId) {
    try {

      //------------------Codigo para obtener el siguiente protocolo--------------------
      var response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/currentOrden', { headers: this.headers }
      ).then((res) => res.json());
      var currentOrder = response.value
      //var currentOrder = 0
      var nextOrder = parseInt(currentOrder, 10) + 1
      var protocol = await model.Protocol.findOne({
        where: { [Op.and]: [{ executed: false }, { project_id: parentCaseId.toString() }, { order: parseInt(nextOrder, 10) }] }
      });
      if (!protocol) {
        return res.status(500).json();
      }
      //-------------------------------fin codigo sig prot--------------------------------------------
      //-------------------------------Codigo para setear el primer protocolo en bonita--------------
      var params = [{ 'value': protocol.id, 'type': 'java.lang.Long' }]
      response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/id_protocol',
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(params[0])
        }
      ).then();
      //----------------------------------------fin set primer prot-------------------------------------------
      //-------------------------------Codigo para setear si se ejecuta local en bonita--------------
      if (parseInt(protocol.isLocal, 10) === 0) { //chequear si funciona bien
        var tipejec = "false"
      } else {
        var tipejec = "true"
      }
      params = [{ 'value': tipejec, 'type': 'java.lang.Boolean' }]
      response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/local',
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(params[0])
        }
      ).then();
      //----------------------------------------fin setear tip ejecc-------------------------------------------
      //-------------------------------Codigo para setear el orden de ejec en bonita--------------
      params = [{ 'value': protocol.order, 'type': 'java.lang.Long' }]
      response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/currentOrden',
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(params[0])
        }
      ).then();
      //----------------------------------------fin setear ord ejecc-------------------------------------------
      //--------------------------------------codigo para cambiar estado protocolo a active---------------------
      params = [{ 'started': 'true' }]


      var updated = model.Protocol.update(
        { started: true },
        { where: { id: protocol.id } }
      )

      if (!updated) {
        console.log("entro al if porque no updateo" + updated)
        return updated;
      };
      return updated;
    } catch (e) { console.log(e) }


  }
  async setDecision(parentCaseId, decision) {
    var params = [{ 'value': decision.toString(), 'type': 'java.lang.String' }]
    const response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/decision',
      {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(params[0])
      }
    ).then();
    return response;
  }
  async setOrder(parentCaseId, orden) {
    var params = [{ 'value': orden.toString(), 'type': 'java.lang.Long' }]
    const response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/currentOrden',
      {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(params[0])
      }
    ).then();
    return response;
  }

  async getDecision(parentCaseId) {
    var response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/decision', { headers: this.headers }
    ).then((res) => res.json());
    if (response) {
      return response.value
    } else {
      console.log("noooo entro al if del get decision porque no hay response")
      return res.status(500).json();
    }

  }
  async setStatus(parentCaseId, estado) {
    var params = [{ 'value': estado.toString(), 'type': 'java.lang.String' }]
    const response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/estado',
      {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(params[0])
      }
    ).then();
    return response;
  }

  async deleteCase(parentCaseId) {
    const response = await fetch(bonita + '/API/bpm/case/' + parentCaseId,
      {
        method: 'DELETE',
        headers: this.headers
      }
    ).then();
    return response;
  }

  async getStatus(parentCaseId) {
    var response = await fetch(bonita + '/API/bpm/caseVariable/' + parentCaseId + '/estado', { headers: this.headers }
    ).then((res) => res.json());
    if (response) {
      return response.value
    } else {
      console.log("noooo entro al if del get decision porque no hay response")
      return res.status(500).json();
    }

  }

  async advanceTask(parentCaseId, userId) {
    try {
      const currentTask = await fetch(bonita + '/API/bpm/humanTask?p=0&c=10&f=parentCaseId=' + parentCaseId, { headers: this.headers }
      ).then((res) => res.json());
      var params = [{ 'assigned_id': userId, 'state': 'completed' }]
      const response = await fetch(bonita + '/API/bpm/humanTask/' + currentTask[0].id,
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(params[0])
        }
      ).then();
      return response;
    } catch (e) { console.log(e) }


  }

  async reencolar(idProtocol, caseId, userId) {
    try {
      var updatedProtocol = await model.Protocol.findOne({
        where: { id: idProtocol },
      });
      if (updatedProtocol) {

        //-------------------------------Codigo para setear el primer protocolo en bonita--------------
        var params = [{ 'value': idProtocol, 'type': 'java.lang.Long' }]
        var response = await fetch(bonita + '/API/bpm/caseVariable/' + caseId + '/id_protocol',
          {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(params[0])
          }
        ).then();
        //----------------------------------------fin set primer prot-------------------------------------------
        //-------------------------------Codigo para setear si se ejecuta local en bonita--------------
        if (updatedProtocol.isLocal == 0) { //chequear si funciona bien.
          var tipejec = "false"
        } else {
          var tipejec = "true"
        }
        params = [{ 'value': tipejec, 'type': 'java.lang.Boolean' }]
        response = await fetch(bonita + '/API/bpm/caseVariable/' + caseId + '/local',
          {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(params[0])
          }
        ).then();
        //----------------------------------------fin setear tip ejecc-------------------------------------------
        //-------------------------------Codigo para setear el orden de ejec en bonita--------------
        params = [{ 'value': updatedProtocol.order, 'type': 'java.lang.Long' }]
        response = await fetch(bonita + '/API/bpm/caseVariable/' + caseId + '/currentOrden',
          {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(params[0])
          }
        ).then();
        //----------------------------------------fin setear ord ejecc-------------------------------------------
        //--------------------------------------codigo para cambiar estado protocolo a active---------------------
        params = [{ 'started': 'true' }]
        var updated = model.Protocol.update(
          { started: true },
          { where: { id: idProtocol } }
        )

        if (!updated) {
          console.log("entro al if porque no updateo" + updated)
          console.log("--------------------*************FINISH malo*******************------------------")
          console.log()
          console.log()
          return updated;
        };
        return updated;

      } else {
        return false;
      }



    } catch (e) {

    }
  }


  //Esto esta para testear el flujo en general

  async testAllFlow() {
    const statusLoggin = await this.login("e.sosa", "bpm");
    if (statusLoggin) {
      const statusProcessDefinition = await this.getProcessDefinitions();
      // si hay mas pool buscar en el arreglo y filtrar el pool que se quiere
      this.processDefinition = statusProcessDefinition[0].id;
      if (statusProcessDefinition) {
        const statusCreateCase = await this.createCase();
        if (statusCreateCase) {
          console.log("RESULT CREATE CASE");
          console.log(statusCreateCase);
          console.log("FINISH RESULT CREATE CASE");
          let statusTask = await this.getIdTask(
            statusCreateCase.processDefinitionId
          );
          console.log("RESULT GET TASK");
          console.log(statusTask);
          console.log("FINISH RESULT GET TASK");
          const resultFilter = statusTask.find(
            (task) => task.caseId == statusCreateCase.id
          );

          console.log("RESULT FILTER TASK");
          console.log(resultFilter);
          console.log("RESULT FILTER TASK");
          await this.advanceTask(resultFilter.id);
        }
      }
    } else {
      console.log(PREFIX, "Error en login");
    }
  }
}

module.exports = new Bonita();
