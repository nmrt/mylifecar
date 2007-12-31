

<?php

function xmlGenerateSchema($a=array('version'=>'1.0','encoding'=>'utf-8'))
{
	
	$r = array();
	foreach($a as $k=>$v) { $r['head']['attributes'][$k] = $v; }
	$r['root'] = array();
	
	return $r;
	
}

?>

