<?php

session_start();

include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";

//
// tip
//
echo '<div class="tip" style="max-width:auto;">';
echo $_userlxml['restore']['tip'][0];
echo '</div>';

?>
<form name="restoreAccountForm" action="/php/script/user/restore.php" method="post"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.restoreAccountForm))
	{
		Event.submit(this);
	}
	return false;
"
>
<table border="0" cellspacing="0" cellpadding="5">
<tr>
<td><?php echo $_userlxml['restore']['acckey'][0]; ?></td>
<td>
<div id="spryv_restoreAccount_key">
<input name="key" size="40" type="text" />
<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
</div>
<script type="text/javascript">
new Spry.Widget.ValidationTextField("spryv_restoreAccount_key", 'custom', {'validateOn':'change'});
</script>
</td>
</tr>
<tr>
<td></td>
<td>
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td>
	<button id="restoreAccountWindowSubmitBtn" type="submit"><?php echo $_userlxml['restore'][0]; ?></button>
	<button id="restoreAccountWindowCloseBtn" type="button" style="display:none;"
	onclick="Window.removeInstance()"
	><?php echo $_userlxml['restore']['close_btn'][0]; ?></button>
	</td>
	<td style="padding-left:5px;"><div class="XMLHttpContainer"></div></td>
	</tr>
	</table>
</td>
</tr>
</table>
</form>