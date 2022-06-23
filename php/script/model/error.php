

<?php

session_start();

//
// preparations
//
$block = $_GET['block'];
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
?><script type="text/javascript">

$_<?php echo $block; ?>SaveError = false;
$_<?php echo $block; ?>DeleteError = false;

</script><?php
if($modelxml)
{
	$modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
	$modelxml = $XML->toArray($modelxml->tagChildren);
}

//
// error function
//
function modelEditError()
{
	
	//
	// vars
	//
	$block = $GLOBALS['block'];
	$modelxml = $GLOBALS['modelxml'];
	$url = parse_url($_SERVER['PHP_SELF']);
	$action = preg_replace("/\.[^\.]*?$/", '', basename($url['path']));
	
	//
	// js error
	//
	echo '<script type="text/javascript">$_'.$block;
	switch($action)
	{
		case 'save' : echo 'Save'; break;
		case 'delete' : echo 'Delete'; break;
	}
	echo 'Error=true;</script>';
	
	//
	// str error
	//
	switch($action)
	{
		case 'save' : $e = 'not_saved'; break;
		case 'delete' : $e = 'not_deleted'; break;
	}
	echo '<span class="failure">'.$modelxml['body']['edit'][$e][0].'</span>';
	//echo '<span class="failure">'.$GLOBALS['modelxml']['body']['edit']['not_saved'][0].':</span> ';
	//echo $GLOBALS['modelxml']['body'][$GLOBALS['block']]['head'][0];
	
	die;
	
}


?>

