

<?php

session_start();

//
// includes
//
include_once 'img/png.php';

//
// variables
//
$_documentRoot = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
$_msie = (preg_match("/\bMSIE\b/", $_SERVER['HTTP_USER_AGENT'])) ? true : false;
$_windowID = $_GET['id'];
$_name = urldecode($_GET['name']);
$_body = urldecode($_GET['body']);

?>
<table class="dataBlock" border="0" cellspacing="0" cellpadding="0">

<td width="1">
<?php
$a = array
(
	'_msie' => array('alt'=>'left top corner')
);
echo img_png('img/corners/light-grey/light-grey-back/lt.png', $_msie, $a);
?>
</td>
<td style="
<?php

$src = 'img/corners/light-grey/light-grey-back/st.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td width="1" align="right">
<?php
$a = array
(
	'_msie' => array('alt'=>'left top corner')
);
echo img_png('img/corners/light-grey/light-grey-back/rt.png', $_msie, $a);
?>
</td>
</tr>
<tr>
<td width="1" style="
<?php

$src = 'img/corners/light-grey/light-grey-back/sl.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>

<!--
//
// head
//
-->
<td class="head" style="background-color:#eee; padding-bottom:4px;">
<table width="100%" border="0" cellspacing="0" cellpadding="6">
<tr>
<td id="window<?php echo $_windowID; ?>handle" style="cursor:move;"><?php echo $_name; ?></td>
<td align="right" width="1" style="cursor:pointer;"
onclick="Window.removeInstance();"
>x</td>
</tr>
</table>
<!-- end: head --></td>

<td width="1" style="
<?php

$src = 'img/corners/light-grey/light-grey-back/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</td>
</tr>
<tr>
<td width="1" style="
<?php

$src = 'img/corners/light-grey/white-back/sl.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>

<!--
//
// core
//
-->
<td class="core coreWhite" style="padding-top:10px;">
<div class="scroll" style="overflow:auto;">

<?php

if($_GET['include']) { include $_body; }
else if($_GET['curl'])
{
	$get = array();
	foreach($_GET['o'] as $k=>$v) { $get[] = "o[$k]=$v"; }
	$ch = curl_init("$_body?".join('&',$get));
	curl_setopt($ch, CURLOPT_POST, true);
	$post = array();
	foreach($_POST as $k=>$v) { $post[] = "$k=$v"; }
	curl_setopt($ch, CURLOPT_POSTFIELDS, join('&', $post));
	curl_exec($ch);
	curl_close($ch);
}
else { echo $_body; }

?>

</div>
<!-- end: core --></td>

<td width="1" style="
<?php

$src = 'img/corners/light-grey/white-back/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>
<tr>
<td width="1">
<?php
$a = array
(
	'_msie' => array('alt'=>'left bottom corner')
);
echo img_png('img/corners/light-grey/white-back/lb.png', $_msie, $a);
?>
</td>
<td style="
<?php

$src = 'img/corners/light-grey/white-back/sb.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td id="window<?php echo $_windowID; ?>resize" width="1" align="right" style="cursor:se-resize;">
<?php
$a = array
(
	'_msie' => array
	(
		'alt'=>'right bottom corner'
	)
);
echo img_png('img/corners/light-grey/white-back/rb.png', $_msie, $a);
?>
</td>
</tr>

</table>

<script type="text/javascript">

$yddWindow<?php echo $_windowID; ?> = new YAHOO.util.DD('window<?php echo $_windowID; ?>');
$yddWindow<?php echo $_windowID; ?>.setHandleElId('window<?php echo $_windowID; ?>handle');
$yddWindow<?php echo $_windowID; ?>resize = new YAHOO.util.DD('window<?php echo $_windowID; ?>resize');

</script>

