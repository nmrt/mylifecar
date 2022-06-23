

<?php

//
// js
//
$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];
$dir = 'js';
$files = array('repository.js','index.js',"page/$gs/$s/$p.js");
foreach($files as $file)
{
	if(is_file("$dir/$file"))
	{
		$mt = filemtime("$dir/$file");
		echo '<script src="/'."$dir/$file?mt=$mt".'" type="text/javascript"></script>'."\n";
	}
}

?>

