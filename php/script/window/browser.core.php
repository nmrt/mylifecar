

<?php

session_start();

//
// variables
//
$_dr = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
$_msie = (preg_match("/\bMSIE\b/", $_SERVER['HTTP_USER_AGENT'])) ? true : false;
$_session = $_SESSION['browser'];
$_lang = $_session['lang'];
$_input = $_session['input'];
$browserHeight = $_session['height'];
$rootdir = $_session['dir'];
$dir = ($x=urldecode($_GET['dir'])) ? $x : $rootdir;

//
// includes
//
include_once "$_dr/php/class/Dir.php"; $Dir = new Dir();
include_once "$_dr/php/class/XML.php"; $XML = new XML();

//
// xml
//
$xml = $XML->parse("$_dr/xml/lang/$_lang/browser.xml");
$xml = $XML->toArray($xml->tagChildren);

?>

<table border="0" cellpadding="5" cellspacing="0">
<tr>

<?php

$files = array();
if($dir && is_dir($dir))
{
	$dr = $Dir->read($dir);
	foreach($dr['d'] as $d) { $files[] = $d; }
	foreach($dr['f'] as $f) { $files[] = $f; }
}
$height = 0;
$column = 1;

//
// [..]
//
function updir($dir)
{
	?>
	<a href="javascript:void(null)" style="display:block;"
	onmouseover="this.style.backgroundColor='#eee'"
	onmouseout="this.style.backgroundColor='#fff'"
	onclick=
	"
		var $brw = Node.getElementByClassName('\\bbrowser\\b', this, {direction:'reverse'});
		var $get =
		[
			'dir=<?php echo urlencode(dirname($dir)); ?>'
		];
		XMLHttp.load
		(
			'http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/window/browser.core.php?'+$get.join('&amp;'),
			{'container':$brw, 'xml':false}
		);
	"
	>[..]</a>
	<?php
}
if(!count($files))
{
	echo '<td>';
	if($dir!=$rootdir) { updir($dir); }
	//
	// dir is empty
	//
	echo '<div class="sansSerif">'.$xml['empty_dir'][0].'</div>';
	echo '</td>';
}

//
// files
//
foreach($files as $file)
{
	
	if($height==0) { echo '<td valign="top">'; }
	
	//
	// up dir
	//
	if($column==1 && $height==0)
	{
		if($dir!=$rootdir) { updir($dir); }
	}
	
	$height += 14;
	
	$f = basename($file);
	if(is_dir($file)) { $f = '['.$f.']'; }
	
	?>
	<a href="javascript:void(null)" style="display:block;"
	onmouseover="this.style.backgroundColor='#eee'"
	onmouseout="this.style.backgroundColor='#fff'"
	<?php if(is_dir($file)) { ?>
	onclick=
	"
		var $win = Node.getElementByClassName('\\bwindow\\s+<?php echo $class; ?>BrowseImage\\b');
		var $brw = Node.getElementByClassName('\\bbrowser\\b', $win);
		var $get =
		[
			'company=<?php echo $company; ?>',
			'model=<?php echo $model; ?>',
			'block=<?php echo $block; ?>',
			'browserHeight=<?php echo $browserHeight; ?>',
			'dir=<?php echo urlencode($file); ?>'
		];
		XMLHttp.load
		(
			'http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/window/browser.core.php?'+$get.join('&amp;'),
			{'container':$brw, 'xml':false}
		);
	"
	<?php } else { ?>
	onclick=
	"
		<?php echo $_input; ?>.value = '<?php echo str_replace($_SESSION['dr'], "http://$_SERVER[HTTP_HOST]", $file); ?>';
		Window.removeInstance();
	"
	<?php } ?>
	><?php echo $f; ?></a>
	<?php
	if($height>=($browserHeight-30))
	{
		$column++;
		$height = 0;
		echo '</td>';
	}
	
}

?>

</tr>
</table>

