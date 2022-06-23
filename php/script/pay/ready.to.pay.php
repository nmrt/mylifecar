<?php

//
// head
//
echo '<h1>';
printf($_xml['ready'][0], $_xml['ready']['using'][$_formName][0]);
echo '</h1>';

echo '<table border="0" cellspacing="0" cellpadding="5">';

//
// companies
//
echo '<tr>';
echo '<td align="left">'.$_xml['ready']['selects']['companies'][0].'</td>';
echo '<td align="left">';
include 'php/script/mysql/connect.php';
?>
<div id="sprySelectWidget_<?php echo $_formName; ?>_company">
<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td>
<select id="<?php echo $_formName; ?>_companies_sel" class="MultiSelect"
onchange=
"
	var $req = XMLHttp.loadNonXML
	(
		'/php/script/window/AdministratorsControlPanel/model.select.php?company='+this.value+'&amp;sid=<?php echo $_formName; ?>_models_sel',
		Node.createDiv({node:ID('pool')})
	);
"
>
<option value="">-</option>
<?php

$q = "SELECT id, realname FROM info ORDER BY realname";
$rr = mysql_query($q, $_mysql['db']['companies']);
while($row=@mysql_fetch_row($rr))
{
	$s = ($row[0]==$_GET['cid']) ? ' selected="selected"' : '';
	echo '<option value="'.$row[0].'"'.$s.'>'.$row[1].'</option>';
}

?>
</select>
</td>
<td style="padding-left:2px;">
<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
</td>
</tr>
</table>
</div>
<script type="text/javascript">
new Spry.Widget.ValidationSelect
(
	'sprySelectWidget_<?php echo $_formName; ?>_company',
	{'validateOn':'change'}
);
</script>
<?php
include 'php/script/mysql/close.php';
echo '</td>';
echo '</tr>';

//
// models
//
?>
<tr>
<td align="left">
<?php echo $_xml['ready']['selects']['models'][0]; ?>
<div style="font-size:9px;"><?php echo $_xml['ready']['selects']['models']['tip'][0]; ?></div>
</td>
<td align="left">
<div id="sprySelectWidget_<?php echo $_formName; ?>_model">
<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td>
<select id="<?php echo $_formName; ?>_models_sel" class="MultiSelect">
<option value="">-</option>
</select>
<?php
$a = array
(
	'company' => $_GET['cid'],
	'model' => $_GET['mid'],
	'sid' => "{$_formName}_models_sel"
);
$bget = array();
foreach($a as $k=>$v)
{
	$bget[$k] = $_GET[$k];
	$_GET[$k] = $v;
}
include 'php/script/window/AdministratorsControlPanel/model.select.php';
foreach($a as $k=>$v) { $_GET[$k] = $bget[$k]; }
?>
</td>
<td style="padding-left:2px;">
<span class="selectRequiredMsg"><?php echo $_xml['ready']['selects']['models']['resrvd'][0]; ?></span>
</td>
</tr>
</table>
</div>
<script type="text/javascript">
new Spry.Widget.ValidationSelect
(
	'sprySelectWidget_<?php echo $_formName; ?>_model',
	{'validateOn':'change'}
);
</script>
</td>
</tr>
<?php

//
// promotion: amount
//
include 'php/script/promo.php';
if($_left)
{
	?>
	<tr>
	<td><?php echo $_xml['ready']['amount']['promo'][0]; ?></td>
	<td align="left">
	<div id="spryv_<?php echo $_formName; ?>_amount">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td><input id="<?php echo $_formName; ?>_amount_inp" type="text" size="3" /></td>
		<td style="padding-left:2px;"><strong>$</strong></td>
		<td style="padding-left:2px;">
		<span class="textfieldMinValueMsg" style="display:inline;"><?php echo $_validatexml['text_field']['min_value'][0]; ?>: 1.00</span>
		<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
		</td>
		</tr>
		</table>
	</div>
	<script type="text/javascript">
	new Spry.Widget.ValidationTextField
	(
		'spryv_<?php echo $_formName; ?>_amount',
		'currency',
		{
			validateOn : 'change',
			useCharacterMasking : true,
			minValue : 1.00/*,
			hint : '1.00'*/
		}
	);
	</script>
	</td>
	</tr>
	<?php
}
// promotion ended
else
{
	?>
	<tr>
	<td><?php echo $_xml['ready']['amount'][0]; ?></td>
	<td><h3 style="padding:0;">$<?php echo $_amount; ?></h3></td>
	</tr>
	<?php
}

//
// btn
//
echo '<tr>';
echo '<td></td>';
?>
<td align="left">
<button type="submit"><?php echo $_xml['btn'][0]; ?></button>
</td>
<?php
echo '</tr>';

echo '</table>';
?>