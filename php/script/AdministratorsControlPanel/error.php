

<?php

session_start();

//
// preparations
//
$url = parse_url($_SERVER['PHP_SELF']);
$action = preg_replace("/\.[^\.]*?$/", '', basename($url['path']));
switch($action)
{
	case 'save' : $target = $_POST['opts']['target']; break;
	case 'delete' : $target = $_GET['target']; break;
}
?><script type="text/javascript">

$_<?php echo $target; ?>SaveError = false;
$_<?php echo $target; ?>DeleteError = false;

</script><?php

//
// error function
//
function adminEditError($type, $desc)
{
	
	//
	// vars
	//
	$target = $GLOBALS['block'];
	$action = $GLOBALS['action'];
	
	//
	// js error
	//
	switch($action)
	{
		case 'save' : $a = 'Save'; break;
		case 'delete' : $a = 'Delete'; break;
	}
	?>
	<script type="text/javascript">
	$_<?php echo $target.$a; ?>Error =
	{
		'type' : '<?php echo addslashes($type); ?>',
		'desc' : '<?php echo addslashes($desc); ?>'
	}
	</script>
	<?php
	
	die;
	
}


?>

