<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<?php

session_start();

//
// php errors
//
//ini_set('display_errors', true);
//error_reporting(E_ALL ^ E_NOTICE | E_STRICT);
//error_reporting(E_ALL ^ E_NOTICE);

//
// global variables
//
include 'php/script/global.variables.php';

//
// classes
//
include 'php/class/Dir.php'; $Dir = new Dir();
include 'php/class/XML.php'; $XML = new XML();
include 'php/class/Vars.php'; $Vars = new Vars(); $Vars->init();

//
// redirect if there is no xml
//
$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];
$f = "xml/lang/$_lang/page/$gs/$s/$p.xml";
if(!is_file($f)) { header('location: /?page=error404'); }

//
// global xml
//
$_languagexml = $Vars->language['body'];
$_xml = $Vars->page['body'];
$_rssxml = $XML->parse("xml/lang/$_SESSION[lang]/rss.xml");
$_rssxml = $XML->toArray($_rssxml->tagChildren);

?>
<head>

<script language="javascript" type="text/javascript">window.preloadImages=[];</script>

<?php include 'php/script/html.head.php'; ?>

</head>
<body>

<div id="XMLHttpPreloadImgBlackVeil" class="BlackVeil"></div>
<div id="XMLHttpPreloadImgBorder" class="XMLHttpPreloadImgBorder"></div>
<div id="XMLHttpPreloadImg" class="XMLHttpPreloadImg">
<table border="0" cellspacing="0" cellpadding="2">
<tr>
<td>
<?php
$src = "http://$_repository/img/preload.img.gif";
$imgs = @getimagesize($src);
?>
<img src="<?php echo $src; ?>" <?php echo $imgs[3]; ?> border="0" alt="pimg" />
</td>
<td><?php echo $_languagexml['ui']['loading'][0]; ?></td>
</tr>
</table>
</div>
<script language="javascript" type="text/javascript">

//
// place func
//
placePagePreloadImg = function()
{
	
	//
	// elements
	//
	var $de = document.documentElement;
	var $pimgbv = document.getElementById('XMLHttpPreloadImgBlackVeil');
	var $pimgb = document.getElementById('XMLHttpPreloadImgBorder');
	var $pimg = document.getElementById('XMLHttpPreloadImg');
	
	//
	// place engine
	//
	$pimgbv.style.width = $de.offsetWidth+'px';
	$pimgbv.style.height = $de.offsetHeight+'px';
	$pimg.style.left = (($de.offsetWidth-$pimg.offsetWidth)/2)+'px';
	$pimg.style.top = (($de.offsetHeight-$pimg.offsetHeight)/2)+'px';
	$pimgb.style.left = $pimg.offsetLeft-10+'px';
	$pimgb.style.top = $pimg.offsetTop-10+'px';
	$pimgb.style.width = $pimg.offsetWidth+20+'px';
	$pimgb.style.height = $pimg.offsetHeight+20+'px';
	
}

placePagePreloadImg();
if(window.addEventListener) { window.addEventListener('resize', placePagePreloadImg, true); }
else { window.attachEvent('onresize', placePagePreloadImg, true); }

</script>

<?php include 'php/script/welcomeWindow.php'; ?>

<?php

//
// global includes
//
include_once 'php/script/img/png.php';
include_once 'php/script/parseDate.php';
include_once 'php/script/tip.php';

//
// global xml
//
$_datexml = $XML->parse("http://$_repository/xml/lang/$_lang/date.xml");
$_datexml = $XML->toArray($_datexml->tagChildren);
include 'php/script/user/text.php';

include 'php/script/js.php';

?>
<script language="javascript" type="text/javascript">

//
// XMLHttp preload image
//
XMLHttp.preloadImg.index++;
XMLHttp.preloadImg.text = '<?php echo $_languagexml['ui']['loading'][0]; ?>';

</script>

<div id="none">

<!--
//
// head
//
-->
<div id="head"><div class="padding">
<?php include 'php/script/body.head.php'; ?>
</div></div>

<!--
//
// content
//
-->
<div id="content"><div class="padding">
<?php

$gs = $Vars->gSection['@name'];
$s = $Vars->section['@name'];
$p = $Vars->page['@name'];
$f = "php/script/page/$gs/$s/$p.php";

/*include_once 'php/script/tidy.php';
ob_start();*/
if(is_file("$_dr/$f")) { include $f; }
else { include 'php/script/page/default.php'; }
/*$xhtml = ob_get_clean();
echo tidy($xhtml);*/

?>
</div></div>

<!--
//
// foot
//
-->
<div id="foot"><div class="padding">
<?php include 'php/script/body.foot.php'; ?>
</div></div>

</div> <!-- none -->

<script type="text/javascript">

//
// browser
//
$_msie = (navigator.appName=='Microsoft Internet Explorer');

//
// hide page preload image
//
XMLHttp.hidePreloadImg();
Spry.Widget.Utils.removeEventListener(window, 'resize', placePagePreloadImg, true);

//
// place
//
ID('none').style.display = 'block';
setTimeout(function(){place('*')}, 1);
Spry.Widget.Utils.addEventListener(window, 'resize', function(){place('*');}, true);

//
// init keys
//
Event.initKeys();
Event.__KEYS__ = [];

//
// Spry AppearFade !
//
MultiSelect.scrollElement = document.getElementById('content');
AppearFades(null,
			function()
			{
				
				//
				// MultiSelect
				//
				MultiSelect.scan();
				
				//
				// page script manager
				//
				var $a = ['gSection','section','page'];
				var $f = 'pageScriptManager';
				var $ok = 0;
				for(var $i in $a)
				{
					$f += '.'+$_query[$a[$i]];
					if(typeof(eval($f))=='object') { $ok++; }
					else { break; }
				}
				if($ok==$a.length) { setTimeout(function(){eval($f+'.init();')}, 1); }
				
			}
			);

//
// document.onclick
//
Spry.Widget.Utils.addEventListener(document, 'click', documentOnclick, true);

//
// tips
//
Spry.Widget.Utils.addEventListener(ID('content'), 'scroll',
function()
{
	var $spans = document.getElementsByTagName('span');
	for(var $i=0; $i<$spans.length; $i++)
	{
		var $span = $spans[$i];
		if($span.className.match(/\btipIBtn\b/)) { tipHide($span); }
	}
}
, true);

</script>

<!--
//
// pool
//
-->
<div id="pool" style="display:none;"></div>

<?php //echo "<script type=\"text/javascript\" src=\"http://statistics.com.ua/counter.php?site=mylifecarcom&amp;ref=".urlencode($_SERVER['HTTP_REFERER'])."\"></script>\n"; ?>

</body>
</html>

<!-- developed by <?php echo file_get_contents('webmaster.txt'); ?> -->
