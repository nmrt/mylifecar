<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();

//
// includes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/units.php";

//
// variables
//
$opts = $_GET['o'];
$_usys = unitsSystem();

//
// target
//
$_targetsg = $opts['target'];
switch($_targetsg)
{
	case 'company': $_targetpl = 'companies'; break;
	case 'model': $_targetpl = 'models'; break;
	case 'user': $_targetpl = 'users'; break;
	case 'rss_item': $_targetpl = 'rss'; break;
	case 'ordered_model': $_targetpl = 'ordered_models'; break;
}

//
// xml
//
$_xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/AdministratorsControlPanel.xml");
$_xml = $XML->toArray($_xml->tagChildren);
$_modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);
$_formxml = $_modelxml['body']['news']['manager']['form'];
$_calendarxml = $_formxml['date']['calendar'];
$_validatexml = $XML->parse("http://$_SESSION[repository]/xml/lang/$_SESSION[lang]/validation.xml");
$_validatexml = $XML->toArray($_validatexml->tagChildren);
$tf = $_userxml['form'];
$ttfv = $_validatexml['text_field'];

?>

<?php

switch($_targetsg)
{
	
	//
	// img
	//
	case 'company':
	case 'model':
	case 'ordered_model':
		$preview_image['target'] = $_targetsg;
		$preview_image['imgid'] = $_POST['id'];
		$preview_image['form'] = 'mainManagerForm';
		include "$_SESSION[dr]/php/script/preview.image.form.php";
		break;
	
}

?>

<form name="mainManagerForm" method="post" enctype="multipart/form-data"
action="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/save.php"
onsubmit="return mainManagerFormOnsubmit(this);">
<input type="hidden" name="opts[target]" value="<?php echo $_targetsg; ?>" />
<input type="hidden" name="opts[id]" value="<?php echo $_POST['id']; ?>" />
<input type="hidden" name="img" />
<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td>
<table border="0" cellspacing="0" cellpadding="5">
<?php

//
// mysql query
//
switch($_targetsg)
{
	
	case 'company':
	case 'model':
		$q = "SHOW COLUMNS FROM info";
		$r = mysql_query($q, $_mysql['db'][$_targetpl]);
		$q = "SELECT * FROM info";
		if($_POST['id']) { $q .= " WHERE id=$_POST[id]"; }
		else { $q .= " WHERE id=1"; }
		$fr = mysql_query($q, $_mysql['db'][$_targetpl]);
		break;
	
	case 'user':
		$q = "SHOW COLUMNS FROM $_targetpl";
		$r = mysql_query($q, $_mysql['db']['main']);
		$q = "SELECT * FROM $_targetpl";
		if($_POST['id']) { $q .= " WHERE id=$_POST[id]"; }
		else { $q .= " WHERE id=1"; }
		$fr = mysql_query($q, $_mysql['db']['main']);
		break;
	
	case 'rss_item':
		$q = "SHOW COLUMNS FROM rss_editor";
		$r = mysql_query($q, $_mysql['db']['main']);
		$q = "SELECT * FROM rss_editor";
		if($_POST['id']) { $q .= " WHERE id=$_POST[id]"; }
		else { $q .= " WHERE id=1"; }
		$fr = mysql_query($q, $_mysql['db']['main']);
		break;
	
	case 'ordered_model':
		$q = "SHOW COLUMNS FROM ordered";
		$r = mysql_query($q, $_mysql['db']['models']);
		$q = "SELECT * FROM ordered";
		if($_POST['id']) { $q .= " WHERE id='$_POST[id]'"; }
		else { $q .= " WHERE id='1'"; }
		$fr = mysql_query($q, $_mysql['db']['models']);
		break;
	
}

//
// mysql fields
//
switch($_targetsg)
{
	
	case 'company':
	case 'model':
	case 'user':
	case 'rss_item':
		$exceptions = array('id','mts');
		break;
	case 'ordered_model':
		$exceptions = array('id','mts','status');
		break;
	
}
$sqlfrow = @mysql_fetch_assoc($fr);
$fi=0; while($sqlrow=mysql_fetch_assoc($r))
{
	
	//
	// field parameters
	//
	$name = $sqlrow['Field'];
	$type = mysql_field_type($fr, $fi);
	$len = mysql_field_len($fr, $fi);
	$_req = ($sqlrow['Null']!='YES') ? '*' : '';
	if($_POST['id']) { $value = $sqlfrow[$name]; }
	else { $value = $sqlrow['Default']; }
	$fi++;
	
	//
	// with some exceptions
	//
	if(in_array($name, $exceptions)) { continue; }
	if(preg_match("/(?i)_unitsys$/", $name)) { continue; }
	
	switch($_targetsg)
	{
		case 'company':
		case 'model':
		case 'rss_item':
		case 'ordered_model':
			
			echo '<tr>';
			echo '<td>'.$name.' <span class="secondary">('.$type.'['.$len.']'.')</span> '.$_req.'</td>';
			echo '<td>';
			
			switch($name)
			{
				
				//
				// company/date
				//
				case 'founded_date':
					?>
					<table border="0" cellspacing="0" cellpadding="0">
					<tr>
					<td>
					<div id="spryTextfieldWidget_mainManager_<?php echo $name; ?>">
					<input id="mainManager_<?php echo $name; ?>Input" type="text"
					name="form[<?php echo $name; ?>]"
					value="<?php echo ($value?$value:date('Y-m-d')); ?>"
					size="<?php echo $len; ?>" />
					<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
					<span class="textfieldInvalidFormatMsg"><?php echo $_validatexml['text_field']['invalid'][0]; ?></span>
					</div>
					</td>
					<td style="padding-left:5px;">
					<?php $_calid = "MainManager_$name"; ?>
					<input type="button" value="<?php echo $_calendarxml['btn'][0]; ?>"
					onclick=
					"
						var $pc = document.getElementById('calendarMainManager_<?php echo $name; ?>PreContainer');
						var $cal = ID('calendar<?php echo $_calid; ?>');
						var $v = $pc.style.visibility;
						var $d = $pc.style.display;
						if($v=='hidden' || $d=='none')
						{
							$pc.style.display = 'block';
							$pc.style.visibility = 'visible';
							$cal.style.display = 'block';
						}
						else
						{
							$pc.style.visibility = 'hidden';
							$cal.style.display = 'none';
						}
					"
					/>
					</td>
					<td valign="top" style="padding-left:5px;">
					<?php
					
					echo '<div id="calendar'.$_calid.'PreContainer" style="visibility:hidden;">';
					
					// menu
					$q = array
					(
						"id=$_calid",
						'cal[syear]='.date('Y'),
						'cal[eyear]='.date('Y'),
						'cal[cmonth]='.date('n'),
						"lang=$_SESSION[lang]"
					);
					$ch = curl_init("$_SESSION[repository]/php/script/calendar/menu.php?".join('&',$q));
					curl_exec($ch);
					curl_close($ch);
					
					echo '<div id="calendar'.$_calid.'Container" style="position:absolute; margin-top:5px;"></div>';
					echo '</div>';
					
					// scripts
					$q = array
					(
						"id=$_calid"
					);
					$ch = curl_init("$_SESSION[repository]/php/script/calendar/scripts.php?".join('&',$q));
					curl_exec($ch);
					curl_close($ch);
					
					// lang
					$q = array
					(
						"lang=$_SESSION[lang]"
					);
					$ch = curl_init("$_SESSION[repository]/php/script/calendar/lang.php?".join('&',$q));
					curl_exec($ch);
					curl_close($ch);
					
					?>
					<script type="text/javascript" language="javascript">
					
					calendar<?php echo $_calid; ?> = new YAHOO.widget.Calendar_lang('calendar<?php echo $_calid; ?>', 'calendar<?php echo $_calid; ?>Container');
					calendar<?php echo $_calid; ?>.onRender = calendar<?php echo $_calid; ?>OnRender;
					calendar<?php echo $_calid; ?>.render();
					calendar<?php echo $_calid; ?>.onSelect = function()
					{
						var $d = calendarOnSelect(calendar<?php echo $_calid; ?>);
						document.getElementById('mainManager_<?php echo $name; ?>Input').value = $d[0]+'-'+$d[1]+'-'+$d[2];
						document.getElementById('calendar<?php echo $_calid; ?>PreContainer').style.display = 'none';
					}
					ID('calendar<?php echo $_calid; ?>').style.display = 'none';
					
					</script>
					</td>
					</tr>
					</table>
					<script type="text/javascript">
					
					<?php echo $name; ?>_vf = function()
					{
						var $inp = document.getElementById('mainManager_<?php echo $name; ?>Input');
						if($inp.value.match(/^(\d{4})(-\d{1,2})?(-\d{1,2})?$/)) { return true; }
						else { return false; }
					}
					
					new Spry.Widget.ValidationTextField
					(
						'spryTextfieldWidget_mainManager_<?php echo $name; ?>', 'custom',
						{'validateOn':'change', 'hint':'yyyy-mm-dd', 'useCharacterMasking':true, 'validation':<?php echo $name; ?>_vf}
					);
					
					</script>
					<?php
					break;
				
				//
				// model/company
				//
				case 'company':
					?>
					<div id="sprySelectWidget_mainManager_<?php echo $name; ?>">
					<select name="form[<?php echo $name; ?>]" class="MultiSelect">
					<option value="">-</option>
					<?php
					
					$q = "SELECT id, realname FROM info ORDER BY realname";
					$rr = mysql_query($q, $_mysql['db']['companies']);
					while($row=@mysql_fetch_row($rr))
					{
						$d = ($row[0]==$value) ? ' selected="selected"' : '';
						echo '<option value="'.$row[0].'"'.$d.'>'.$row[1].'</option>';
					}
					
					?>
					</select>
					<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
					</div>
					<script type="text/javascript">
					new Spry.Widget.ValidationSelect
					(
						'sprySelectWidget_mainManager_<?php echo $name; ?>',
						{'validateOn':'change'}
					);
					</script>
					<?php
					break;
				
				//
				// ordered_model/uid
				//
				case 'uid':
					?>
					<div id="sprySelectWidget_mainManager_<?php echo $name; ?>">
					<select name="form[<?php echo $name; ?>]" class="MultiSelect">
					<?php
					
					$q = "SELECT * FROM users ORDER BY nickname";
					$rr = mysql_query($q, $_mysql['db']['main']);
					while($row=@mysql_fetch_assoc($rr))
					{
						$d = ($row['id']==$value) ? ' selected="selected"' : '';
						echo '<option value="'.$row['id'].'"'.$d.'>'.$row['nickname'].'</option>';
					}
					
					?>
					</select>
					<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
					</div>
					<script type="text/javascript">
					new Spry.Widget.ValidationSelect
					(
						'sprySelectWidget_mainManager_<?php echo $name; ?>',
						{'validateOn':'change'}
					);
					</script>
					<?php
					break;
				
				//
				// all another
				//
				default:
					switch($type)
					{
						case 'int': $stype = 'integer'; break;
						case 'real': $stype = 'real'; break;
						default: $stype = 'custom'; break;
					}
					?>
					<table border="0" cellspacing="0" cellpadding="0">
					<tr>
					<td>
					<div id="spryTextfieldWidget_mainManager_<?php echo $name; ?>">
					<?php
					
					switch($_targetsg)
					{
						case 'rss_item':
							switch($name)
							{
								case 'link':
									$id = 'mainManagerRssLink_inp';
									break;
							}
							break;
					}
					
					?>
					<input <?php echo ($id?'id="'.$id.'"':''); ?> type="text"
					name="form[<?php echo $name; ?>]"
					value="<?php echo $value; ?>"
					size="<?php echo min($len, 65); ?>" />
					<?php if($_req) { ?><span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span> <?php } ?>
					<span class="textfieldInvalidFormatMsg"><?php echo $_validatexml['text_field']['invalid'][0].' ('.$type.')'; ?></span>
					<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $len"; ?></span>
					</div>
					<script type="text/javascript">
					new Spry.Widget.ValidationTextField
					(
						'spryTextfieldWidget_mainManager_<?php echo $name; ?>',
						'<?php echo $stype; ?>',
						{
							<?php if(!$_req) { echo 'isRequired:false,'."\n"; } ?>
							'validateOn':'change',
							'maxChars':<?php echo $len ?>
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
					$ak = array_keys($sqlfrow);
					if(in_array("{$name}_unitsys", $ak))
					{
						echo '<select name="form['."{$name}_unitsys".']" class="MultiSelect">';
						foreach($systs as $sys)
						{
							$s = ($sys==$_usys || $sys==$sqlfrow["{$name}_unitsys"]) ? ' selected="selected"' : '';
							echo '<option value="'.$sys.'"'.$s.'>'.$_modelxml['body']['tech_info'][$name]['unit'][$sys][0].'</option>';
						}
						echo '</select>';
					}
					else
					{
						echo $_modelxml['body']['tech_info'][$name]['unit'][$_usys][0];
					}
					
					?>
					</td>
					</tr>
					</table>
					<?php
					break;
				
			}
			
			echo '</td>';
			echo '</tr>';
			
			break;
		
		case 'user':
			
			switch($name)
			{
				
				//
				// user/page
				//
				case 'page':
					
					//$page = split('/', $value);
					$page = $value;
					$q = "SELECT company FROM info WHERE id=$page";
					$cr = mysql_query($q, $_mysql['db']['models']);
					$cid = @mysql_result($cr, 0);
					
					echo '<tr>';
					echo '<td>company (or Administrator) *</td>';
					echo '<td>';
						?>
						<div id="sprySelectWidget_mainManager_<?php echo "{$name}_company"; ?>">
						<select name="form[<?php echo $name; ?>][company]" class="MultiSelect"
						onchange=
						"
							if(!this.value)
							{
								this.isRequired = false;
								$_spryv_mainManager_page_model.isRequired = false;
							}
							else
							{
								this.isRequired = true;
								$_spryv_mainManager_page_model.isRequired = (this.value=='Administrator') ? false : true;
							}
							var $get =
							[
								'company='+this.value,
								'sid=mainManagerUserPageModelSelect'
							];
							XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/window/AdministratorsControlPanel/model.select.php?'+$get.join('&amp;'),
							{'container':ID('pool'), 'xml':false});
						"
						>
						<option value="">none</option>
						<?php $d = ($page=='Administrator') ? ' selected="selected"' : ''; ?>
						<option value="Administrator"<?php echo $d; ?>>Administrator</option>
						<?php
						
						$q = "SELECT id, realname FROM info ORDER BY realname";
						$rr = mysql_query($q, $_mysql['db']['companies']);
						while($row=@mysql_fetch_row($rr))
						{
							$d = ($row[0]==$cid) ? ' selected="selected"' : '';
							echo '<option value="'.$row[0].'"'.$d.'>'.$row[1].'</option>';
						}
						
						?>
						</select>
						<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
						</div>
						<script type="text/javascript">
						new Spry.Widget.ValidationSelect
						(
							'sprySelectWidget_mainManager_<?php echo "{$name}_company"; ?>',
							{'validateOn':'change', 'isRequired':false}
						);
						</script>
						<?php
					echo '</td>';
					echo '</tr>';
					
					echo '<tr>';
					echo '<td>model</td>';
					echo '<td>';
						?>
						<div id="sprySelectWidget_mainManager_<?php echo "{$name}_model"; ?>">
						<select id="mainManagerUserPageModelSelect" name="form[<?php echo $name; ?>][model]" class="MultiSelect">
						<option value="">-</option>
						</select>
						<?php
						
						include "$_SESSION[dr]/php/script/mysql/close.php";
						$a = array
						(
							'company' => $cid,
							'model' => $page,
							'sid' => 'mainManagerUserPageModelSelect'
						);
						$bget = array();
						foreach($a as $k=>$v)
						{
							$bget[$k] = $_GET[$k];
							$_GET[$k] = $v;
						}
						include 'model.select.php';
						foreach($a as $k=>$v) { $_GET[$k] = $bget[$k]; }
						
						?>
						<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
						</div>
						<script type="text/javascript">
						$_spryv_mainManager_page_model = new Spry.Widget.ValidationSelect
						(
							'sprySelectWidget_mainManager_<?php echo "{$name}_model"; ?>',
							{'validateOn':'change', 'isRequired':false}
						);
						</script>
						<?php
					echo '</td>';
					echo '</tr>';
					
					break;
				
				//
				// user/pagest
				//
				case 'pagest':
					?>
					<td>pagest</td>
					<td>
					<div id="sprySelectWidget_mainManager_<?php echo $name; ?>">
					<select name="form[<?php echo $name; ?>]" class="MultiSelect">
					<option value="">-</option>
					<?php
					
					$a = array('Pending');
					foreach($a as $v)
					{
						$d = ($value==$v) ? ' selected="selected"' : '';
						echo '<option value="'.$v.'"'.$d.'>'.$v.'</option>';
					}
					
					?>
					</select>
					<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
					</div>
					<script type="text/javascript">
					new Spry.Widget.ValidationSelect
					(
						'sprySelectWidget_mainManager_<?php echo $name; ?>',
						{'validateOn':'change', 'isRequired':false}
					);
					</script>
					</td>
					<?php
					break;
				
			}
			
			break;
		
	}
	
}

?>

<?php

switch($_targetsg)
{
	case 'company':
	case 'rss_item':
		
		?>
		<!--
		//
		// desc
		//
		-->
		<tr>
		<td class="nobr" valign="top" style="border-top: 2px solid #eee;"><?php echo $_xml['body']['form']['desc'][0]; ?> *</td>
		<td style="border-top: 2px solid #eee;">
		<?php
			
			$get = array
			(
				'buttons=all',
				'iframe=mainManagerIframe',
				'lang='.$_SESSION['lang'],
				'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
				'dir='.urlencode("$_SESSION[dr]/img/users/{$_SESSION[user][id]}")
			);
			$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
			curl_exec($ch);
			curl_close($ch);
			
			switch($_targetsg)
			{
				case 'company': $dir = $_targetsg; break;
				case 'rss_item': $dir = 'rss/editor'; break;
			}
			$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/$dir/$_POST[id].xml";
			if(is_file($f))
			{
				$xml = $XML->parse($f);
				$xml = $XML->toArray($xml->tagChildren);
			}
			else { $xml = array(); }
			
			?>
			<div id="mainManagerIframeForSale" class="xml"><?php echo $xml['desc'][0]; ?></div>
			<?php
		
		?>
		</td>
		</tr>
		
		<?php
		break;

}

?>

<!--
//
// submit
//
-->
<tr>
<td></td>
<td>
<input type="submit" value="<?php echo $_modelxml['body']['edit']['save_btn'][0]; ?>" />
<?php echo $_userxml['form']['required'][0]; ?>
<div class="XMLHttpContainer" style="display:none;"></div>
</td>
</tr>

</table>
</td>
<td valign="top">
<?php

switch($_targetsg)
{
	case 'rss_item':
		$ch = curl_init("http://$_SERVER[HTTP_HOST]/php/script/site.map.php?input=mainManagerRssLink_inp");
		curl_exec($ch);
		curl_close($ch);
		break;
}

?>
</td>
</tr>
</table>

</form>

<script language="javascript" type="text/javascript">

mainManagerFormOnsubmit = function($ev)
{
	
	try
	{
		var $form = document.mainManagerForm;
		<?php if($x=$_previewImageFormID) { ?>
		$SpryWidgetValidation_previewImage<?php echo $x; ?>.isRequired = false;
		<?php } ?>
		if(Spry.Widget.Form.onSubmit($ev, $form))
		{
			var $n = Node.getElementByName('xml', $form);
			if($n && !$n.contentWindow.document.body.innerHTML) { return false; }
			Event.submit($form, '', '', function()
			{
				var $n = document.getElementById('main.client');
				var $core = Node.getElementByClassName('\\bcore\\b', $n);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'target=<?php echo $_targetpl; ?>',
					'saveError='+$_<?php echo $_targetsg; ?>SaveError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/main.client.php?'+$get.join('&'),
				{'container':$padd, 'xml':false, 'callback':function($el)
				{
					AppearFades($el, function(){ MultiSelect.scan($el); });
					Window.removeInstance();
				}
				});
			});
		}
		return false;
	}
	catch($e) { Debuger.output($e); }
	return false;
	
}

</script>