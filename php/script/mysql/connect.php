<?php

session_start();

//
// variables
//
include 'conf.php';

if(!function_exists('mysql_set_charset'))
{
  function mysql_set_charset($charset, $dbh)
  {
    return mysql_query("SET NAMES $charset", $dbh);
  }
}

//
// engine
//
foreach($dbs as $db)
{
	if(!is_resource($_mysql['db'][$db]))
	{
		$_mysql['db'][$db] = mysql_connect($_mysql['conf']['host'], $_mysql['conf']['user'], $_mysql['conf']['pass'], true);
		mysql_set_charset('utf8', $_mysql['db'][$db]);
		mysql_select_db($dbNameBase.'_'.$db.$_SESSION['lang'], $_mysql['db'][$db]);
	}
}

?>