<?php

//
// main variables
//
$_topic = ($x=$_GET['topic']) ? $x : 'glance';

echo '<table width="'.(!$_msie?100:98).'%" border="0" cellpadding="0" cellspacing="0">';
echo '<tr>';

//
// text block
//
echo '<td valign="top">';
$dataBlockHeadText = $_xml['topics'][$_topic][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// core
//
include "php/script/help/$_topic.php";

include 'php/script/dataBlock.foot.php';
echo '</td>';

//
// topics block
//
echo '<td valign="top" width="300" style="padding: 0 10px;">';
$dataBlockHeadText = $_xml['topics'][0];
$options = array
(
	'width100' => true,
	'AppearFade' => true
);
include 'php/script/dataBlock.head.php';

//
// core
//
echo '<table border="0" cellspacing="0" cellpadding="5">';
foreach($_xml['topics'] as $topicn=>$topicv)
{
	if(is_array($topicv))
	{
		echo '<tr>';
		echo '<td align="center" valign="middle">';
		if($topicn==$_topic) { echo '<img src="/img/ui/rarr.gif" alt="rarr" border="0" />'; }
		else { echo '&bull;'; }
		echo '</td>';
		echo '<td>';
		if($topicn!=$_topic) { echo '<a href="/?page=help&amp;topic='.$topicn.'" class="typeB">'; }
		echo $topicv[0];
		if($topicn!=$_topic) { echo '</a>'; }
		echo '</td>';
		echo '</tr>';
	}
}
echo '</table>';

include 'php/script/dataBlock.foot.php';
echo '</td>';

echo '</tr>';
echo '</table>';

?>