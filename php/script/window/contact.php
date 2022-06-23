<?php

session_start();

//
// includes
//
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
include_once "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";

//
// access dinied
//
if(!$_SESSION['user'])
{
	echo $_userxml['ui']['must_be_logged_in'][0];
}

//
// access granted
//
else
{
	
	?>
	<form name="contactForm" action="/php/script/contact.php" method="post"
	onsubmit=
	"
		if(Spry.Widget.Form.onSubmit(this, document.contactForm)) { Event.submit(this); }
		return false;
	"
	>
	<table border="0" cellspacing="0" cellpadding="5">
	<tr>
	<td><?php echo $_userlxml['contact_us']['subject'][0]; ?></td>
	<td>
	<div id="spryv_subject">
	<input name="form[subject]" type="text" size="50" />
	<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
	</div>
	<script type="text/javascript">
	new Spry.Widget.ValidationTextField('spryv_subject', 'custom', {validateOn:'change'});
	</script>
	</td>
	</tr>
	<tr>
	<td valign="top"><?php echo $_userlxml['contact_us']['message'][0]; ?></td>
	<td>
	<?php
	
	$get = array
	(
		'buttons=all',
		'iframe=contactIframe',
		'lang='.$_SESSION['lang'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SESSION[dr]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	
	?>
	<div id="contactIframeForSale" class="form[message]"></div>
	</td>
	</tr>
	<tr>
	<td></td>
	<td>
	<button id="contactFormSendBtn" type="submit"><?php echo $_userlxml['contact_us']['btn'][0]; ?></button>
	<button id="contactFormCloseBtn" type="button" style="display:none;"
	onclick="Window.removeInstance()"
	><?php echo $_userlxml['contact_us']['btn']['close'][0]; ?></button>
	<span class="XMLHttpContainer" style="margin-left:5px;"></span>
	</td>
	</tr>
	</table>
	</form>
	
<?php
}
?>