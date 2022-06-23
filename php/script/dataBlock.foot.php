

<!-- end: core --></div></div></td>
<td width="1" style="
<?php

$src = 'img/corners/light-grey/white-back/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>
<tr>
<td class="lbCornerWhite" width="1">
<?php
$alt = array('alt'=>'left bottom corner');
$a = array
(
	'_msie' => $alt
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
<td class="rbCornerWhite" width="1" align="right">
<?php
$alt = array('alt'=>'right bottom corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('img/corners/light-grey/white-back/rb.png', $_msie, $a);
?>
</td>
</tr>
<!-- end: <?php echo $dataBlockName ?> --></table>
