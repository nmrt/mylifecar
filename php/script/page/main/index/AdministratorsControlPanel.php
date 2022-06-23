

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
$_block = ($x=$_GET['block']) ? $x : 'main.client';
$_targetpl = ($x=$_GET['target']) ? $x : 'models';

//
// includes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include_once "$_SESSION[dr]/php/script/img/png.php";

//
// xml
//
if(!$_languagexml)
{
	$_languagexml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/index.xml");
	$_languagexml = $XML->toArray($_languagexml->tagChildren);
	$_languagexml = $_languagexml['body'];
}
if(!$_xml)
{
	$_xml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/AdministratorsControlPanel.xml");
	$_xml = $XML->toArray($_xml->tagChildren);
	$_xml = $_xml['body'];
}
$_buttonsxml = $_xml['buttons'];
$_alertsxml = $_xml['alerts'];

if($_SESSION['user']['page']=='Administrator')
{
	
	//
	// buttons
	//
	echo '<div align="right">';
	echo '<table border="0" cellspacing="0" cellpadding="5">';
	echo '<tr>';
	$a = array('main.client'=>array('companies','models','users','rss','ordered_models'));
	foreach($a as $block=>$v)
	{
		foreach($v as $target)
		{
			$d = ($block==$_block && $target==$_targetpl) ? 'style="color:red!important;"' : '';
			echo '<td>';
			?>
			<button type="button" <?php echo $d; ?>
			onclick=
			"
				var $c = document.getElementById('content');
				var $p = Node.getElementByClassName('\\bpadding\\b', $c);
				var $get =
				[
					'block=<?php echo $block; ?>',
					'target=<?php echo $target; ?>'
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/page/main/index/AdministratorsControlPanel.php?'+$get.join('&amp;'),
				{'container':$p, 'xml':false, 'callback':function($el){ AppearFades($el, function(){ MultiSelect.scan($el); }); }});
			"
			><?php echo $_buttonsxml[$target][0]; ?></button>
			<?php
			echo '</td>';
		}
	}
	echo '</tr>';
	echo '</table>';
	echo '</div>';
	
	//
	// block
	//
	$dataBlockHeadText = $_buttonsxml[$_targetpl][0];
	$dataBlockName = $_block;
	$options = array
	(
		'width100'=>true,
		'AppearFade'=>true
	);
	include "$_SESSION[dr]/php/script/dataBlock.head.php";
	include "$_SESSION[dr]/php/script/AdministratorsControlPanel/$_block.php";
	include "$_SESSION[dr]/php/script/dataBlock.foot.php";
	
}
else
{
	echo '<h1>'.$_languagexml['alerts']['access_denied'][0].' '.$_languagexml['alerts']['admins_only'][0].'</h1>';
	include "$_SESSION[dr]/php/script/user/text.php";
	$continue = urlencode("$_SERVER[PHP_SELF]?$_SERVER[QUERY_STRING]");
	echo '<a href="/?page=user&amp;action=login.form&amp;continue='.$continue.'">'.$_userxml['login']['button'][0].'</a>';
}

?>

