

<?php

$_error = false;

//
// error func
//
function error($alert='', $name='')
{
	
	// trigger error
	$GLOBALS['_error'] = true;
	
	if(!$alert) { $alert = 'failure'; }
	
	// alert
	echo '<h2 class="error">'.$GLOBALS['alerts'][$alert][0].(($x=$name)?": $x":'').'</h2>';
	
	// tip
	if($x=$GLOBALS['alerts'][$alert]['tip'][0])
	{
		echo '<div class="tip">'.$x.'</div>';
	}
	
	// form
	if(is_file("$_GET[action].form.php")) { include "$_GET[action].form.php"; }
	
}


?>

