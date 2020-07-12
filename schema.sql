Drop database if exists employee_trackerDB;
create database employee_trackerDB;

use employee_trackerDB;

create table department (
id int not null auto_increment,
name varchar(30) not null,
primary key (id)
);

create table role (
id int auto_increment not null,
title varchar(30) not null,
salary decimal(10,4) not null,
department_id int not null,
primary key(id)
);

create table employee (
id int auto_increment not null,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id int not null,
manager_id int not null,
primary key(id)
);