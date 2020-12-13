CREATE TABLE users (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
    name VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	createdAt TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
);

CREATE TABLE projects (
    project_id serial NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR ( 50 ) NOT NULL,
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    createdAt TIMESTAMP,
)
    
CREATE TABLE protocols (
	protocol_id serial PRIMARY KEY,
    user_id INT NOT NULL,
	name VARCHAR ( 50 ) NOT NULL,
    order INT NOT NULL,    
    isLocal BOOLEAN NOT NULL,
	startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    createdAt TIMESTAMP,
    project_id serial,
    score real    
);
    
CREATE TABLE roles(
   role_id serial PRIMARY KEY,
   name VARCHAR (255) UNIQUE NOT NULL
);

/*INSERTS*/

/*USERS*/
INSERT INTO 
    users (user_id,username, password, name, email, createdAt,last_login)
VALUES
    (1,'juanperez','francocapo', 'juan perez','jp@gmail.com','2020-01-01','2020-01-01'),
    (2,'juanperez2','francocapo', 'juan perez2','jp2@gmail.com','2020-01-01','2020-01-01'),
    (3,'juanperez3','francocapo', 'juan perez3','jp3@gmail.com','2020-01-01','2020-01-01'),
    (4,'juanperez4','francocapo', 'juan perez4','jp4@gmail.com','2020-01-01','2020-01-01'),
    (5,'juanperez5','francocapo', 'juan perez5','jp5@gmail.com','2020-01-01','2020-01-01'),
    (6,'juanperez6','francocapo', 'juan perez6','jp6@gmail.com','2020-01-01','2020-01-01'),

/*ROLES*/
INSERT INTO 
    roles (role_id,name)
VALUES
    (1,'Admin'),
    (2,'User')

/*PROJECTS*/
INSERT INTO 
    projects (project_id, name, user_id, startDate, endDate, createdAt)
VALUES
    (1,'projecto 1',1,'2020-01-01','2021-01-01','2020-01-01'),
    (2,'projecto 2',1,'2020-01-01','2021-01-01','2020-01-01'),
    (3,'projecto 3',2,'2020-01-01','2021-01-01','2020-01-01'),
    (4,'projecto 4',2,'2020-01-01','2021-01-01','2020-01-01'),
    (5,'projecto 5',4,'2020-01-01','2021-01-01','2020-01-01'),
    (6,'projecto 6',3,'2020-01-01','2021-01-01','2020-01-01'),
    (7,'projecto 7',5,'2020-01-01','2021-01-01','2020-01-01'),
    (8,'projecto 8',6,'2020-01-01','2021-01-01','2020-01-01'),
    (9,'projecto 9',7,'2020-01-01','2021-01-01','2020-01-01')

/*PROTOCOLS*/
INSERT INTO 
    protocols (protocol_id,user_id,name, order, isLocal, startDate, endDate, createdAt, project_id, score)
VALUES
    (1,'prueba de vacuna',2, 0,'2020-01-01','2021-01-01','2020-01-01',1,1.5),
    (2,'prueba de vacuna2',2, 0,'2020-01-01','2021-01-01','2020-01-01',1,1.5),
    (3,'prueba de vacuna3',2, 0,'2020-01-01','2021-01-01','2020-01-01',1,6.5),
    (4,'prueba de vacuna4',2, 0,'2020-01-01','2021-01-01','2020-01-01',2,10),
    (5,'prueba de vacuna5',2, 0,'2020-01-01','2021-01-01','2020-01-01',2,10),
    (6,'prueba de vacuna6',2, 0,'2020-01-01','2021-01-01','2020-01-01',3,9.5),
    (7,'prueba de vacuna7',2, 0,'2020-01-01','2021-01-01','2020-01-01',4,8),
    (8,'prueba de vacuna8',2, 0,'2020-01-01','2021-01-01','2020-01-01',5,5),
    (9,'prueba de vacuna9',2, 0,'2020-01-01','2021-01-01','2020-01-01',6,8)