
<?php

//
// continue
//
if($x=$_GET['continue'])
{
	$_SESSION['continue'] = urldecode($x);
}

include "php/script/user/text.php";

?>

<table width="<?php echo (!$_msie?100:98) ?>%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td class="action" valign="top">

<?php

//
// action
//
$a = $_GET['action'];
if($x=strrpos($a,'.')) { $a = substr($a,0,$x); }

// image
$f = "img/ui/color/$a.png";
if(is_file("$_SESSION[dr]/$f"))
{
	$_m = array
	(
		'alt'=>$text[$a]['button'][0],
		'title'=>$text[$a]['button'][0],
		'border'=>'0'
	);
	$m = array('title'=>$text[$a]['button'][0]);
	$img = img_png($f, $_msie, array('_msie'=>$_m,'msie'=>$m));
	$dataBlockHeadImg = $img;
}

$dataBlockHeadText = $text[$a]['button'][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// action OR not
//

if($report=$_SESSION['report'])
{
	echo $report;
	$_SESSION['report'] = '';
}
if($x=$_GET['action']) { include "php/script/user/$x.php"; }
else
{
	if(!$report)
	{
		$u = ($_SESSION['user']['first_name'] && $_SESSION['user']['last_name'])
		? $_SESSION['user']['first_name'].' '.$_SESSION['user']['last_name']
		: $_SESSION['user']['nickname'];
		$un = ($x=$_SESSION['user']) ? $u : $text['ui']['guest'][0];
		echo '<h1>'.$text['ui']['welcome'][0].', '.$un.'</h1>';
		if(!$_SESSION['user']) { include 'php/script/user/login.form.php'; }
	}
}

include 'php/script/dataBlock.foot.php';

?>

</td>
<td class="panel" width="300" valign="top">

<?php

//
// panel
//
$dataBlockHeadImg = '';
$dataBlockHeadText = $_xml['ui']['panel'][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// user NOT logged in
//
$a = array('login.form','signin.form');
foreach($a as $v)
{
	$pv = $v;
	if($x=strrpos($v,'.')) { $pv = substr($v,0,$x); }
?>
<table class="links" border="0" cellspacing="0" cellpadding="0">
<tr class="AppearFade" style="visibility:hidden;">
<td width="1">
<?php

if(!$_SESSION['user']) { echo '<a href="/?page=user&amp;action='.$v.'">'; }
$_m = array
(
	'alt'=>$text[$pv]['button'][0],
	'title'=>$text[$pv]['button'][0],
	'border'=>'0'
);
$ma = array('title'=>$text[$pv]['button'][0],'class'=>'pointer');
$mna = array('title'=>$text[$pv]['button'][0]);
if(!$_SESSION['user']) { echo img_png("img/ui/color/$pv.png", $_msie, array('_msie'=>$_m,'msie'=>$ma)); }
else { echo img_png("img/ui/grayscale/$pv.png", $_msie, array('_msie'=>$_m,'msie'=>$mna)); }
if(!$_SESSION['user']) { echo '</a>'; }

?>
</td>
<td>
<?php

if(!$_SESSION['user']) { echo '<a href="/?page=user&amp;action='.$v.'">'; }
echo $text[$pv]['button'][0];
if(!$_SESSION['user']) { echo '</a>'; }

?>
</td>
</tr>
</table>
<?php
}

//
// user logged in
//
$a = array('edit.form','logout');
foreach($a as $v)
{
	
	$pv = $v;
	if($x=strrpos($v,'.')) { $pv = substr($v,0,$x); }
	
	?>
	<table class="links" border="0" cellspacing="0" cellpadding="0">
	<tr class="AppearFade" style="visibility:hidden">
	<td width="1">
	<?php
	
	if($_SESSION['user']) { echo '<a href="/?page=user&amp;action='.$v.'">'; }
	$_m = array
	(
		'alt'=>$text[$pv]['button'][0],
		'title'=>$text[$pv]['button'][0],
		'border'=>'0'
	);
	$ma = array('title'=>$text[$pv]['button'][0],'class'=>'pointer');
	$mna = array('title'=>$text[$pv]['button'][0]);
	if($_SESSION['user']) { echo img_png("img/ui/color/$pv.png", $_msie, array('_msie'=>$_m,'msie'=>$ma)); }
	else { echo img_png("img/ui/grayscale/$pv.png", $_msie, array('_msie'=>$_m,'msie'=>$mna)); }
	if($_SESSION['user']) { echo '</a>'; }
	
	?>
	</td>
	<td>
	<?php
	
	if($_SESSION['user']) { echo '<a href="/?page=user&amp;action='.$v.'">'; }
	echo $text[$pv]['button'][0];
	if($_SESSION['user']) { echo '</a>'; }
	
	?>
	</td>
	</tr>
	</table>
	<?php
	
}
?>

<?php

//
// edit page OR AdministratorsControlPanel
//
$user = $_SESSION['user'];
include 'php/script/mysql/connect.php';
$q = "SELECT * FROM users WHERE nickname='$user[nickname]'";
$r = mysql_query($q, $_mysql['db']['main']);
$row = @mysql_fetch_assoc($r);
$atext = $_xml['ui']['edit_page_btn'][0];
if($row['page'] && $row['page']!='Administrator' && !$row['pagest'])
{
	$src = 'img/ui/color/edit.page.png';
	$a = '<a href="/?page=model&amp;model='.$row['page'].'&amp;edit=true">';
}
else if($row['page']=='Administrator')
{
	$src = 'img/ui/color/edit.page.png';
	$a = '<a href="/?page=AdministratorsControlPanel">';
	$atext = $_xml['ui']['acp_btn'][0];
}
else
{
	$src = 'img/ui/grayscale/edit.page.png';
	$a = '';
}

?>
<table class="links" border="0" cellspacing="0" cellpadding="6">
<tr class="AppearFade" style="visibility:hidden">
<td>
<?php
echo $a;
$_m = array
(
	'alt'=>$_userText['edit_page']['button'][0],
	'title'=>$_userText['edit_page']['button'][0],
	'border'=>'0'
);
$m = array('title'=>$text['edit_page']['button'][0]);
if($a) { $m['class'] = 'pointer'; }
echo img_png($src, $_msie, array('_msie'=>$_m,'msie'=>$m));
if($a) { echo '</a>'; }
?>
</td>
<td>
<?php
echo $a;
echo $atext;
if($a) { echo '</a>'; }
?>
</td>
</tr>
</table>
<?php

include 'php/script/mysql/close.php';
include 'php/script/dataBlock.foot.php';

?>

</td>
</tr>
</table>

