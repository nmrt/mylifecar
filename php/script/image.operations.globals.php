

<?php

session_start();

//
// vars
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
$_languagexml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/index.xml");
$_languagexml = $XML->toArray($_languagexml->tagChildren);
$_languagexml = $_languagexml['body'];
$_alerts = $_languagexml['alerts']['img_save'];

//
// restore form submit buttons function
//
?>
<script type="text/javascript">
imgSaveResFormSubBtns = function()
{
	<?php if($x=$_POST['form']) { ?>
	var $f = top.document.<?php echo $x; ?>;
	$f.img.value = '<?php echo $f; ?>';
	var $allbtns = [];
	var $inps = $f.getElementsByTagName('input');
	var $btns = $f.getElementsByTagName('button');
	for(var $i=0; $i<$inps.length; $i++) { $allbtns.push($inps[$i]); }
	for(var $i=0; $i<$btns.length; $i++) { $allbtns.push($btns[$i]); }
	for(var $i=0; $i<$allbtns.length; $i++)
	{
		var $btn = $allbtns[$i];
		if($btn.type=='submit') { $btn.disabled = false; }
	}
	<?php } ?>
}
</script>
<?php

//
// error func
//
function imgEditError($alert='', $return=false)
{
	
	if(!$alert) { $alert = 'failure'; }
	
	// alert
	$r = '<h6 class="error">'.$GLOBALS['_alerts'][$alert][0].'</h6>';
	
	// tip
	if($x=$GLOBALS['_alerts'][$alert]['tip'][0])
	{
		$r .= '<div class="tip" style="font-size:11px; padding:5px;">'.$x.'</div>';
	}
	
	if($return) { return $r; }
	else
	{
		echo $r;
		?><script type="text/javascript">imgSaveResFormSubBtns();</script><?php
		die;
	}
	
}

?>

