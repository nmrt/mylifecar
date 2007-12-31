

<?php

session_start();

// variables
$_calid = 'NewsExtended';
if(!$codeCompanyName) { $codeCompanyName = $_GET['company']; }
if(!$codeModelName) { $codeModelName = $_GET['model']; }

//
// calendar active dates
//
include 'calendar.active.dates.php';

$get = array
(
	"id=$_calid",
	'get='.urlencode("page=model&model=$codeModelName&extended_block=news"),
	'date='.$_SESSION['model']['extended']['news']['date'],
	'cal[syear]='.$_cal['syear'],
	'cal[eyear]='.$_cal['eyear'],
	'cal[cmonth]='.$_cal['cmonth'],
	"lang=$_SESSION[lang]"
);
$ch = curl_init("http://$_SESSION[repository]/php/script/calendar/for.pages.php?".join('&', $get));
curl_exec($ch);
curl_close($ch);

?>

