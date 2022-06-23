

<?php

//
// variables
//
include 'text.php';
$tf = $text['form'];
$ttfv = $validate['text_field'];
$minChars = 4;
$maxChars = 255;

?>

<div class="tip"><?php

$_userlxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/user.xml");
$_userlxml = $XML->toArray($_userlxml->tagChildren);
echo $_userlxml['signin']['after_benefits'][0];

?></div>

<form name="signinForm" method="post" enctype="multipart/form-data" action="?page=user&amp;action=signin">
<table border="0" cellspacing="0" cellpadding="6">

<!--
//
// nickname
//
-->
<tr class="AppearFade" style="visibility:hidden;">
<td valign="top"><?php echo $tf['nickname'][0] ?></td>
<td valign="top">*</td>
<td valign="top">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td valign="top">
	<div id="spryTextfieldWidget_nickname">
	<input id="nickname_inp" type="text" name="sql[nickname]" value="<?php echo $_POST['sql']['nickname'] ?>" size="40" />
	<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
	<span class="textfieldMinCharsMsg"><?php echo $ttfv['min_chars'][0]." $minChars" ?></span>
	<span class="textfieldMaxCharsMsg"><?php echo $ttfv['max_chars'][0]." $maxChars" ?></span>
	<span class="textfieldInvalidFormatMsg" style="display:block;"><?php echo $ttfv['invalid_name'][0] ?></span>
	</div>
	</td>
	<td valign="top" style="padding-left:5px;">
	<input type="button" value="<?php echo $tf['nickname']['check_if_is_free'][0]; ?>"
	onclick=
	"
		if($spryv_nickname.validate())
		{
			XMLHttp.load('php/script/user/check.if.nickname.is.free.php?n='+ID('nickname_inp').value,
			{'container':this.parentNode.nextSibling, 'xml':false});
		}
	"
	/>
	</td><td valign="top" style="padding-left:5px;">&nbsp;</td>
	</tr>
	</table>
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
<input type="text" name="sql[first_name]" value="<?php echo $_POST['sql']['first_name'] ?>" size="40" />
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
<input type="text" name="sql[last_name]" value="<?php echo $_POST['sql']['last_name'] ?>" size="40" />
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
<input type="text" name="sql[email]" value="<?php echo $_POST['sql']['email'] ?>" size="40" />
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

if(!$_SESSION['localhost'])
{
	require_once "Net/GeoIP.php";
	$geoip = Net_GeoIP::getInstance("/var/www/nnn/GeoIP.dat", Net_GeoIP::SHARED_MEMORY);
	$cc = ($x=$_POST['sql']['cc']) ? $x : strtolower($geoip->lookupCountryCode($_SERVER['REMOTE_ADDR']));
}
else { $cc = 'ua'; }
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
// password
//
-->
<tr class="AppearFade" style="visibility:hidden;">
<td><?php echo $tf['password'][0] ?></td>
<td>*</td>
<td>
<div id="spryTextfieldWidget_password">
<input id="password_inp" type="password" name="sql[password]" size="40" />
<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
</div>
</td>
<!-- end: password --></tr>


<!--
//
// password2
//
-->
<tr class="AppearFade" style="visibility:hidden;">
<td><?php echo $tf['cpassword'][0]; ?></td>
<td>*</td>
<td>
<div id="spryTextfieldWidget_password2">
<input type="password" name="password2" size="40" />
<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
<span class="textfieldInvalidFormatMsg"><?php echo $ttfv['invalid_passwords'][0] ?></span>
</div>
</td>
<!-- end: password2 --></tr>

<tr class="AppearFade" style="visibility:hidden;">
<td></td>
<td></td>
<td align="left">
<input type="submit" value="<?php echo $text['signin']['button'][0] ?>" />
<?php echo $tf['required'][0]; ?>
</td>
</tr>

</table>
</form>

<script type="text/javascript">

var nvf = function()
{
	var $n = ID('nickname_inp').value;
	if($n.match(/^[a-zA-Z_]+[a-zA-Z0-9_]+$/)) { return true; }
	else { return false; }
}

var pvf = function()
{
	var $f = document.signinForm;
	var $p = ID('password_inp').value;
	var $p2 = $f.password2.value;
	if($p==$p2) { return true; }
	else { return false; }
}

$spryv_nickname = new Spry.Widget.ValidationTextField('spryTextfieldWidget_nickname', 'custom', {'validateOn':'change', 'minChars':<?php echo $minChars ?>, 'maxChars':<?php echo $maxChars ?>, 'validation':nvf});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_first_name', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_last_name', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_email', 'email', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationSelect('spryv_country', {validateOn:'change'});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_password', 'custom', {'validateOn':'change'});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_password2', 'custom', {'validateOn':'change', 'validation':pvf});

</script>

