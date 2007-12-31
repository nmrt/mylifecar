<?php

$dataBlockName = $_GET['extended_block'];
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include "php/script/dataBlock.head.php";

$sen =& $_SESSION['model']['extended']['conversation'];
$a = array('minUnits','startUnits');
foreach($a as $v)
{
	if(isset($_GET[$v])) { $sen[$v] = $_GET[$v]; }
}
if(!$sen['minUnits']) { $sen['minUnits'] = 20; }
include "$_SESSION[dr]/php/script/model/$_GET[extended_block].php";
include "php/script/dataBlock.foot.php";

?>