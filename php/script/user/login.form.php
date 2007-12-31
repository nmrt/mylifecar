
<?php

//
// variables
//
include 'text.php';
$tf = $text['form'];
$ttfv = $validate['text_field'];

?>

<form name="loginForm" method="post" enctype="application/x-www-form-urlencoded"
action="?page=user&amp;action=login">
<!-- &amp;continue=<?php echo urlencode($_SERVER['HTTP_REFERER']); ?> -->
<table border="0" cellspacing="0" cellpadding="6">

<!--
//
// nickname
//
-->
<tr>
<td><?php echo $tf['nickname'][0] ?></td>
<td>
<span id="spryTextfieldWidget_nickname">
<input type="text" name="nickname" size="25" value="<?php echo $_POST['nickname'] ?>" />
<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
</span>
</td>
<!-- end: nickname --></tr>

<!--
//
// password
//
-->
<tr class="AppearFade" style="visibility:hidden;">
<td><?php echo $tf['password'][0] ?></td>
<td>
<span id="spryTextfieldWidget_password">
<input type="password" name="password" size="25" />
<span class="textfieldRequiredMsg"><?php echo $ttfv['required'][0] ?></span>
</span>
</td>
<!-- end: password --></tr>

<!--
//
// submit button
//
-->
<tr class="AppearFade" style="visibility:hidden;">
<td></td><td align="left">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td><input type="submit" value="<?php echo $text['login']['button'][0] ?>" /></td>
	<td style="padding-left:5px;">
	<a href="javascript:void(null)" class="secondary js"
	onclick=
	"
		var $o =
		{
			'class'		: 'restoreAccount',
			'name'		: '<?php echo urlencode($_userlxml['restore'][0]); ?>',
			'body'		: '<?php echo urlencode('window/restoreAccount.php'); ?>',
			'include'	: true
		}
		Window.addInstance($o);
	"
	><?php echo $_userlxml['ui']['forgot_nickname_password'][0]; ?></a>
	</td>
	</tr>
	</table>
</td>
</tr>

</table>
</form>

<script type="text/javascript">

new Spry.Widget.ValidationTextField("spryTextfieldWidget_nickname", 'none', {'validateOn':'change'});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_password', 'none', {'validateOn':'change'});

</script>
