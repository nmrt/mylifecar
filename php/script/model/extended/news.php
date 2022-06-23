

<table width="<?php echo (!$_msie?100:98); ?>%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td width="100%" valign="top" style="padding: 0 5px;">
<?php

$dataBlockName = $_GET['extended_block'];
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include "php/script/dataBlock.head.php";

$sen =& $_SESSION['model']['extended']['news'];
$a = array('minUnits','startUnits','date');
foreach($a as $v)
{
	if(isset($_GET[$v])) { $sen[$v] = $_GET[$v]; }
}
if(!$sen['minUnits']) { $sen['minUnits'] = 20; }
include "$_SESSION[dr]/php/script/model/$_GET[extended_block].php";
include "php/script/dataBlock.foot.php";

?>
</td>
<td valign="top" style="padding: 0 5px;">

<?php

$dataBlockName = 'calendar';
$options = array
(
	'width100'=>true,
	'AppearFade'=>true
);
include "php/script/dataBlock.head.php";
include "php/script/model/extended/news/calendar.php";
include "php/script/dataBlock.foot.php";

?>
</td>
</tr>
</table>
