<?php

function catchFatalError($_code, $_str='')
{
	
	//
	// DOM element id
	//
	$pfeid = 'phpFatalError'.strtoupper(md5(uniqid(rand(),true)));
	
	//
	// assign new and store old values
	//
    $old_display_errors = ini_set('display_errors', true);
	$old_error_reporting = error_reporting(E_ERROR);
    $old_error_prepend_string = ini_set('error_prepend_string', '<div id="'.$pfeid.'" style="display:none;">');
    ob_start();
	?>
	<script type="text/javascript">
	setTimeout
	(
		function()
		{
			top.Node.remove(top.ID('<?php echo $pfeid; ?>'));
		}
		, 1
	);
	</script>
	<?php
	$script = ob_get_clean();
	$old_error_append_string = ini_set('error_append_string', '</div>'.$script.$_str);
	
	//
	// evaluate suspect code
	//
	$return = eval($_code);
	
	//
	// return old values, if no fatal error occurred
	//
    ini_set('display_errors', $old_display_errors);
	error_reporting($old_error_reporting);
    ini_set('error_prepend_string', $old_error_prepend_string);
    ini_set('error_append_string', $old_error_append_string);
	
	//
	// return whatever evaluated code returned
	//
	return $return;
	
}

?>