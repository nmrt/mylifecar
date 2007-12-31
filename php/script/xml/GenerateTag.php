

<?php

function xmlGenerateTag($name, $attrs, $data='')
{
	
	$r = array
	(
		'name' => $name,
		'attributes' => $attrs,
		'data' => $data
	);
	
	return $r;
	
}

?>

