<?php

session_start();

$_mysql = array();
$_mysql['conf']['host'] = 'localhost';
$_mysql['conf']['user'] = 'namart';
$_mysql['conf']['pass'] = 'n06a01m1987';

$dbs = array('main','companies','models');
$dbNameBase = str_replace('.','',$_SESSION['defaultDomain']);

?>