<?php

session_start();

//
// includes
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
include "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/units.php";

//
// main variables
//
$_usys = unitsSystem();

//
// xml
//
$_payxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/pay.xml");
$_payxml = $XML->toArray($_payxml->tagChildren);
$_payxml = $_payxml['body'];
$_modelxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);
$_modelxml = $_modelxml['body'];

//
// head tip
//
echo '<div class="tip" style="width:500px;">';
echo $_payxml['ready']['order_model']['tip'][0];
echo '</div>';

include_once "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";

//
// img
//
$preview_image['target'] = 'model';
$preview_image['imgid'] = '';
$preview_image['form'] = 'orderModelForm';
echo '<div style="margin-bottom:5px;">';
include "$_SESSION[dr]/php/script/preview.image.form.php";
echo '</div>';

?>

<form name="orderModelForm" action="/php/script/model/order.php" method="post"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.orderModelForm))
	{
		Event.submit(this);
	}
	return false;
"
>
<input name="img" type="hidden" />

<table border="0" cellspacing="0" cellpadding="5">

<!--
//
// company
//
-->
<tr>
<td><?php echo $_payxml['ready']['order_model']['company'][0]; ?></td>
<td>*</td>
<td>
<div id="spryv_om_company">
<select name="form[company][value]" class="MultiSelect">
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
<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
</div>
<input name="form[company][type]" value="int" type="hidden" />
<script type="text/javascript">
new Spry.Widget.ValidationSelect('spryv_om_company', {validateOn:'change'});
</script>
</td>
</tr>

<!--
//
// model
//
-->
<tr>
<td><?php echo $_payxml['ready']['order_model']['model'][0]; ?></td>
<td>*</td>
<td>
<div id="spryv_om_model">
<input name="form[realname][value]" type="text" size="25" />
<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
</div>
<input name="form[realname][type]" value="string" type="hidden" />
<input name="form[realname][len]" value="765" type="hidden" />
<script type="text/javascript">
new Spry.Widget.ValidationTextField('spryv_om_model', 'custom', {validateOn:'change'});
</script>
</td>
</tr>

<?php

//
// configuration
//
$q = "SHOW COLUMNS FROM info";
$sqlr_shc = mysql_query($q, $_mysql['db']['models']);
$q = "SELECT * FROM info WHERE id='1'";
$sqlr_sel = mysql_query($q, $_mysql['db']['models']);

$exceptions = array('id','company','realname');
$sqlrow_sel = @mysql_fetch_assoc($sqlr_sel);
$fi=0; while($sqlrow_shc=mysql_fetch_assoc($sqlr_shc))
{
	
	//
	// field parameters
	//
	$fname = mysql_field_name($sqlr_sel, $fi);
	$ftype = mysql_field_type($sqlr_sel, $fi);
	$flen = (int)mysql_field_len($sqlr_sel, $fi);
	$fvalue = $sqlrow_shc['Default'];
	$freq = ($sqlrow_shc['Null']!='YES') ? '*' : '';
	$fi++;
	
	//
	// with some exceptions
	//
	if(in_array($fname, $exceptions)) { continue; }
	if(preg_match("/(?i)_unitsys$/", $fname)) { continue; }
	
	//
	// engine
	//
	switch($ftype)
	{
		case 'int': $stype = 'integer'; break;
		case 'real': $stype = 'real'; break;
		default: $stype = 'custom'; break;
	}
	?>
	<tr>
	<td><?php echo $_modelxml['tech_info'][$fname][0]; ?></td>
	<td><?php echo $freq; ?></td>
	<td>
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<div id="spryv_<?php echo $fname; ?>">
		<input
			type="text"
			name="form[<?php echo $fname; ?>][value]"
			value="<?php echo $fvalue; ?>"
			size="<?php echo min($flen, 25); ?>"
		/>
		<?php if($freq) { ?><span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span> <?php } ?>
		<span class="textfieldInvalidFormatMsg"><?php echo $_validatexml['text_field']['invalid'][0].' ('.$ftype.')'; ?></span>
		<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0].": $flen"; ?></span>
		</div>
		<input name="form[<?php echo $fname; ?>][type]" value="<?php echo $ftype; ?>" type="hidden" />
		<input name="form[<?php echo $fname; ?>][len]" value="<?php echo $flen; ?>" type="hidden" />
		<script type="text/javascript">
		new Spry.Widget.ValidationTextField
		(
			'spryv_<?php echo $fname; ?>',
			'<?php echo $stype; ?>',
			{
				<?php if(!$freq) { echo 'isRequired:false,'."\n"; } ?>
				'validateOn':'change',
				'maxChars':<?php echo $flen; ?>
			}
		);
		</script>
		</td>
		<td style="padding-left:5px;">
		<?php
		
		//
		// units system
		//
		$systs = array('met','imp');
		$ak = array_keys($sqlrow_sel);
		if(in_array("{$fname}_unitsys", $ak))
		{
			echo '<select name="form['."{$fname}_unitsys".'][value]" class="MultiSelect">';
			foreach($systs as $sys)
			{
				$s = ($sys==$_usys) ? ' selected="selected"' : '';
				echo '<option value="'.$sys.'"'.$s.'>'.$_modelxml['tech_info'][$fname]['unit'][$sys][0].'</option>';
			}
			echo '</select>';
			$i=0; foreach($sqlrow_sel as $k=>$v)
			{
				if($k=="{$fname}_unitsys")
				{
					$t = mysql_field_type($sqlr_sel, $i);
					$l = mysql_field_len($sqlr_sel, $i);
				}
				$i++;
			}
			echo '<input name="form['."{$fname}_unitsys".'][type]" value="'.$t.'" type="hidden" />';
			echo '<input name="form['."{$fname}_unitsys".'][len]" value="'.$l.'" type="hidden" />';
		}
		else
		{
			echo $_modelxml['tech_info'][$fname]['unit'][$_usys][0];
		}
		
		?>
		</td>
		</tr>
		</table>
	</td>
	</tr>
	<?php
	
}

?>

<!--
//
// submit btn
//
-->
<tr>
<td></td>
<td></td>
<td>
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td>
	<button id="orderModelSubmitBtn" type="submit"><?php echo $_payxml['ready']['order_model']['btn']['send'][0]; ?></button>
	<button id="orderModelCloseBtn" type="button" style="display:none;"
	onclick="Window.removeInstance()"
	>
	<?php echo $_payxml['ready']['order_model']['btn']['close'][0]; ?>
	</button>
	</td>
	<td style="padding-left:5px;"><div class="XMLHttpContainer"><?php echo $_userxml['form']['required'][0]; ?></div></td>
	</tr>
	</table>
</td>
</tr>

</table>
</form>