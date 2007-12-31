
<?php

//
// variables
//
include 'text.php';
$user = $_SESSION['user'];
$tf = $text['form'];
$ttfv = $validate['text_field'];
$minChars = 4;
$maxChars = 255;

if($user)
{
	
	//
	// img
	//
	$preview_image['target'] = 'user';
	$preview_image['imgid'] = $user['id'];
	$preview_image['form'] = 'editForm';
	include "$_SESSION[dr]/php/script/preview.image.form.php";
	
	?>
	
	<form name="editForm" method="post" enctype="multipart/form-data"
	action="?page=user&amp;action=edit"
	onsubmit="return editFormOnsubmit(this);"
	>
		<input type="hidden" name="desc" />
		<input type="hidden" name="img" />
		<table border="0" cellspacing="0" cellpadding="6">
		
		<!--
		//
		// nickname
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td valign="top"><?php echo $tf['nickname'][0] ?></td>
		<td valign="top">*</td>
		<td>
		<div id="spryTextfieldWidget_nickname">
		<input id="nickname_inp" type="text" name="sql[nickname]" value="<?php echo (($x=$_POST['sql']['nickname'])?$x:$user['nickname']) ?>" size="40" />
		<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
		<span class="textfieldMinCharsMsg"><?php echo $ttfv['min_chars'][0]." $minChars" ?></span>
		<span class="textfieldMaxCharsMsg"><?php echo $ttfv['max_chars'][0]." $maxChars" ?></span>
		<span class="textfieldInvalidFormatMsg" style="display:block;"><?php echo $ttfv['invalid_name'][0] ?></span>
		</div>
		</td>
		<!-- end: nickname --></tr>
		
		<!--
		//
		// first_name
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td><?php echo $tf['first_name'][0] ?></td>
		<td></td>
		<td>
		<div id="spryTextfieldWidget_first_name">
		<input type="text" name="sql[first_name]" value="<?php echo (($x=$_POST['sql']['first_name'])?$x:$user['first_name']) ?>" size="40" />
		<span class="textfieldMaxCharsMsg"><?php echo $ttfv['max_chars'][0]." $maxChars" ?></span>
		</div>
		</td>
		<!-- end: first_name --></tr>
		
		<!--
		//
		// last_name
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td><?php echo $tf['last_name'][0] ?></td>
		<td></td>
		<td>
		<div id="spryTextfieldWidget_last_name">
		<input type="text" name="sql[last_name]" value="<?php echo (($x=$_POST['sql']['last_name'])?$x:$user['last_name']) ?>" size="40" />
		<span class="textfieldMaxCharsMsg"><?php echo $ttfv['max_chars'][0]." $maxChars" ?></span>
		</div>
		</td>
		<!-- end: last_name --></tr>
		
		<!--
		//
		// email
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td><?php echo $tf['email'][0] ?></td>
		<td>*</td>
		<td>
		<div id="spryTextfieldWidget_email">
		<input type="text" name="sql[email]" value="<?php echo (($x=$_POST['sql']['email'])?$x:$user['email']) ?>" size="40" />
		<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
		<span class="textfieldMaxCharsMsg"><?php echo $ttfv['max_chars'][0]." $maxChars" ?></span>
		<span class="textfieldInvalidFormatMsg"><?php echo $ttfv['invalid'][0] ?></span>
		</div>
		</td>
		<!-- end: email --></tr>
		
		<!--
		//
		// country
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td>
		<?php echo $tf['country'][0] ?>
		<div class="secondary"><?php echo $tf['country']['tip'][0] ?></div>
		</td>
		<td valign="top">*</td>
		<td valign="top">
		<div id="spryv_country">
		<select name="sql[cc]" class="MultiSelect">
		<?php
		
		$cc = ($x=$_POST['sql']['cc']) ? $x : $_SESSION['user']['cc'];
		include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
		$q = "SELECT * FROM countries";
		$r = mysql_query($q, $_mysql['db']['main']);
		while($row=@mysql_fetch_assoc($r))
		{
			$s = ($row['cc']==$cc) ? ' selected="selected"' : '';
			echo '<option value="'.$row['cc'].'"'.$s.'>'.$row['intername'].'</option>';
		}
		include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
		
		?>
		</select>
		<span class="selectRequiredMsg"><?php echo $_validatexml['select']['required'][0]; ?></span>
		</div>
		</td>
		<!-- end: country --></tr>
		
		<!--
		//
		// desc
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td valign="top"><?php echo $tf['desc'][0] ?></td>
		<td></td>
		<td>
		<?php
		
		$get = array
		(
			'buttons=all',
			'iframe=editIframe',
			'lang='.$_SESSION['lang'],
			'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
			'dir='.urlencode("$_SESSION[dr]/img/users/{$_SESSION[user][id]}")
		);
		$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
		curl_exec($ch);
		curl_close($ch);
		
		$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/user/$user[id].xml";
		if(is_file($f))
		{
			$xml = $XML->parse($f);
			$xml = $XML->toArray($xml->tagChildren);
			$desc = $xml['desc'][0];
		}
		else { $desc = $_POST['desc']; }
		
		?>
		<div id="editIframeForSale" class="desc"><?php echo $desc; ?></div>
		</td>
		<!-- end: desc --></tr>
		
		<!--
		//
		// password
		//
		-->
		<tr class="AppearFade" style="visibility:hidden;">
		<td><?php echo $tf['password'][0] ?></td>
		<td>*</td>
		<td>
		<div id="spryTextfieldWidget_password">
		<input type="password" name="sql[password]" size="40" />
		<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
		</div>
		</td>
		<!-- end: password --></tr>
		
		</table>
		
		<fieldset class="not_change_passwd AppearFade" style="visibility:hidden; background-color:#fff;">
		<legend>
		<label style="margin-right:5px;">
		<input type="checkbox" checked="checked" align="right"
		onchange="
		var $fs = Node.getElementByClassName('\\bnot_change_passwd\\b', this, {'direction':'reverse'});
		var $inpts = $fs.getElementsByTagName('input');
		for(var $i=0; $i<$inpts.length; $i++)
		{
			if($inpts[$i].type!='checkbox')
			{
				if(!$_msie)
				{
					if($inpts[$i].attributes.getNamedItem('disabled')) { $inpts[$i].attributes.removeNamedItem('disabled'); }
					else { Node.setAttrs({'disabled':'disabled'}, $inpts[$i]); }
				}
				else
				{
					$inpts[$i].disabled = ($inpts[$i].disabled) ? false : true;
				}
			}
		}
		"
		/>
		<?php echo $text['edit']['not_change_passwd'][0] ?>
		</label>
		</legend>
			<table border="0" cellspacing="0" cellpadding="6">
			
			<!--
			//
			// npassword
			//
			-->
			<tr class="AppearFade" style="visibility:hidden;">
			<td><?php echo $tf['npassword'][0] ?></td>
			<td>
			<div id="spryTextfieldWidget_npassword">
			<input type="password" name="npassword" size="40" disabled="disabled" />
			<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
			</div>
			</td>
			<!-- end: npassword --></tr>
			
			<!--
			//
			// npassword2
			//
			-->
			<tr class="AppearFade" style="visibility:hidden;">
			<td><?php echo $tf['cnpassword'][0]; ?></td>
			<td>
			<div id="spryTextfieldWidget_npassword2">
			<input type="password" name="npassword2" size="40" disabled="disabled" />
			<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
			<span class="textfieldInvalidFormatMsg"><?php echo $ttfv['invalid_passwords'][0] ?></span>
			</div>
			</td>
			<!-- end: npassword2 --></tr>
			
			</table>
		</fieldset>
		
		<div class="AppearFade" style="padding: 20px 10px 10px 10px; visibility:hidden; background-color:white;">
		<input type="submit" value="<?php echo $text['edit']['button'][0] ?>" />
		<?php echo $tf['required'][0]; ?>
		</div>
		
		</form>
	
	<script type="text/javascript">
	
	var editFormOnsubmit = function($ev)
	{
		var $form = document.editForm;
		$SpryWidgetValidation_previewImage<?php echo $_previewImageFormID; ?>.isRequired = false;
		if(Spry.Widget.Form.onSubmit($ev, $form))
		{
			var $desc = document.getElementById('editIframe');
			var $xhtml = $desc.contentWindow.document.body.innerHTML;
			var $xhtml = $xhtml.replace(/&/g, '<amp/>');
			$form.desc.value = $xhtml;
		}
		else { return false; }
	}
	
	var nvf = function()
	{
		var $n = ID('nickname_inp').value;
		if($n.match(/^[a-zA-Z_]+[a-zA-Z0-9_]+$/)) { return true; }
		else { return false; }
	}
	
	var npvf = function()
	{
		var $f = document.editForm;
		var $p = $f.npassword.value;
		var $p2 = $f.npassword2.value;
		if($p==$p2) { return true; }
		else { return false; }
	}
	
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_nickname', 'custom', {'validateOn':'change', 'minChars':<?php echo $minChars ?>, 'maxChars':<?php echo $maxChars ?>, 'validation':nvf});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_first_name', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_last_name', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_email', 'email', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});
	new Spry.Widget.ValidationSelect('spryv_country', {validateOn:'change'});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_password', 'custom', {'validateOn':'change'});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_npassword', 'custom', {'validateOn':'change'});
	new Spry.Widget.ValidationTextField('spryTextfieldWidget_npassword2', 'custom', {'validateOn':'change', 'validation':npvf});
	
	</script>
    
	<?php
}
else
{
	$_SESSION['report'] = '<h2>'.$_userxml['ui']['must_be_logged_in'][0].'</h2>';
	?><script type="text/javascript">location.href='/?page=user&action=login.form';</script><?php
}

?>

