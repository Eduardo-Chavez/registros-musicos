/*Creacion de la base de datos*/
Create database registroMusicos;

Use registroMusicos;

/*Creacion de la tabla usuarios*/
Create table usuario(
    cveUsuario smallint not null,
    nombre varchar(350) not null,
    apellidos varchar(350) not null,
    username varchar(150) not null,
    password varchar(350) not null
);

/*Primary key cveUsuario*/
Alter table usuario Add primary key (cveUsuario);

/*Auto incrementar cveUsuario*/
Alter table usuario modify cveUsuario smallint not null auto_increment, auto_increment = 1;

/*Tabla departamentos*/
Create table musico(
    cveMusico smallint not null,
    nombre varchar(500) not null,
    direccion varchar(500) not null,
    instrumento varchar(500) not null,
    fecha varchar(500) not null,
    cveEncargado smallint,
    created_at timestamp not null default current_timestamp,
    constraint fk_user foreign key (cveEncargado) references usuario(cveUsuario)
);

/*Primary key cveDepartamento*/
Alter table musico Add primary key (cveMusico);

/*Auto incrementar cveDepartamento*/
Alter table musico modify cveMusico smallint not null auto_increment, auto_increment = 1;

Describe usuario;