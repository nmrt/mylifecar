

<?php

session_start();

//
// variables
//
$_opts = $_GET['o'];
$maxChars = 255;

//
// includes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";

//
// xml
//
$_modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);
$_modelxml = $_modelxml['body'];
$_formxml = $_modelxml['conversation']['manager']['form'];

//
// sql
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM conversation WHERE id=$_POST[id]";
$r = mysql_query($q, $_mysql['db']['main']);
$_sqlrow = @mysql_fetch_assoc($r);
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";

?>

<?php

$get = array
(
	'block=conversation'
);

?>
<form name="conversationManagerForm" method="post"
action="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/save.php?<?php echo join('&amp;', $get); ?>"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this.event||window.event, this))
	{
		var $desc = ID('conversationManagerIframe');
		if($desc.contentWindow.document.body.innerHTML)
		{
			Event.submit(this, '', '', function()
			{
				var $n = ID('conversation');
				var $core = Node.getElementByClassName('\\bcore\\b', $n);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'model=<?php echo $_opts['model']; ?>',
					'saveError='+$_conversationSaveError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/conversation.php?'+$get.join('&amp;'),
				{'container':$padd, 'xml':false, 'callback':function(){AppearFades($padd);}});
				Window.removeInstance();
			});
		}
	}
	return false;
"
>
<input type="hidden" name="form[mid]" value="<?php echo $_opts['model']; ?>" />
<input type="hidden" name="type" value="<?php echo (($x=$_opts['type'])?$x:'add'); ?>" />
<input type="hidden" name="id" value="<?php echo $_POST['id']; ?>" />
<table border="0" cellspacing="0" cellpadding="5">

<!--
//
// title
//
-->
<tr>
<td class="nobr"><?php echo $_formxml['title'][0]; ?></td>
<td>*</td>
<td>
<div id="spryTextfieldWidget_title">
<input type="text" name="form[title]" value="<?php echo $_sqlrow['title']; ?>" style="width:100%;" /> 
<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0].": $maxChars"; ?></span>
</div>
</td>
</tr>

<!--
//
// desc
//
-->
<tr>
<td valign="top" class="descTD nobr"><?php echo $_formxml['desc'][0]; ?></td>
<td valign="top" class="descTD">*</td>
<td class="descTD">
<?php
	
	$get = array
	(
		'buttons=all',
		'iframe=conversationManagerIframe',
		'lang='.$_SESSION['lang'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SERVER[DOCUMENT_ROOT]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	?>
	<div id="conversationManagerIframeForSale" class="form[descrpt]"><?php echo $_sqlrow['descrpt']; ?></div>
	<?php

?>
</td>
</tr>

<!--
//
// submit
//
-->
<tr>
<td></td>
<td></td>
<td>
<input
type="submit"
value="<?php echo $_modelxml['edit']['save_btn'][0]; ?>"
/><span class="XMLHttpContainer"></span>
<?php echo $_userxml['form']['required'][0]; ?>
</td>
</tr>

</table>
</form>

<script type="text/javascript">

new Spry.Widget.ValidationTextField('spryTextfieldWidget_title', 'custom', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});

</script>

