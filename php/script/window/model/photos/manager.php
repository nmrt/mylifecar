

<?php

session_start();

//
// variables
//
$opts = $_GET['o'];
$company = $opts['company'];
$model = $opts['model'];
$maxChars = 255;

//
// includes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";

//
// xml
//
$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$xml = $XML->toArray($xml->tagChildren);
$form = $xml['body']['photos']['manager']['form'];
$tf = $_userxml['form'];
$ttfv = $_validatexml['text_field'];

//
// sql
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM photos WHERE id=$_POST[id]";
$r = mysql_query($q, $_mysql['db']['main']);
$_sqlrow = @mysql_fetch_assoc($r);
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";

?>

<?php

//
// img
//
$preview_image['target'] = 'model';
$preview_image['cid'] = $company;
$preview_image['mid'] = $model;
$preview_image['block'] = 'photos';
$preview_image['imgid'] = $_POST['id'];
$preview_image['form'] = 'photosManagerForm';
include "$_SESSION[dr]/php/script/preview.image.form.php";

?>

<?php

$get = array
(
	'block=photos'
);

?>
<form name="photosManagerForm" method="post"
action="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/save.php?<?php echo join('&amp;', $get); ?>"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.photosManagerForm))
	{
		
		var $desc = Node.getElementByName('desc', this);
		if($desc.contentWindow.document.body.innerHTML)
		{
			Event.submit(this, '', '', function()
			{
				var $photos = document.getElementById('photos');
				var $core = Node.getElementByClassName('\\bcore\\b', $photos);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'model=<?php echo $model; ?>',
					'saveError='+$_photosSaveError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/photos.php?'+$get.join('&amp;'),
				{'container':$padd, 'xml':false, 'callback':function(){AppearFades($padd);}});
				Window.removeInstance();
			});
		}
	}
	return false;
"
>
<input type="hidden" name="form[model]" value="<?php echo $model; ?>" />
<input type="hidden" name="type" value="<?php echo (($x=$opts['type'])?$x:'add'); ?>" />
<input type="hidden" name="id" value="<?php echo $_POST['id']; ?>" />
<input type="hidden" name="img" />
<table border="0" cellspacing="0" cellpadding="5">

<!--
//
// title
//
-->
<tr>
<td class="nobr"><?php echo $form['title'][0]; ?></td>
<td>
<div id="spryTextfieldWidget_title">
<input type="text" name="form[title]" value="<?php echo $_sqlrow['title']; ?>" style="width:100%;" />
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $maxChars" ?></span>
</div>
</td>
</tr>

<!--
//
// desc
//
-->
<tr>
<td valign="top" class="descTD nobr"><?php echo $form['desc'][0]; ?></td>
<td class="descTD">
<?php
	
	$get = array
	(
		'buttons=all',
		'iframe=photosManagerIframe',
		'lang='.$_SESSION['lang'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SERVER[DOCUMENT_ROOT]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	?>
	<div id="photosManagerIframeForSale" class="desc"><?php
	
	$f = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/model/photos/$_POST[id].xml";
	if($_POST['id'] && is_file($f))
	{
		$desc = $XML->parse($f);
		$desc = $XML->toArray($desc->tagChildren);
		echo $desc['desc'][0];
	}
	
	?></div>
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
<td>
<input
type="submit"
value="<?php echo $xml['body']['edit']['save_btn'][0]; ?>"
/><span class="XMLHttpContainer"></span>
<?php echo $_userxml['form']['required'][0]; ?>
</td>
</tr>

</table>
</form>

<script type="text/javascript">

//new Spry.Widget.ValidationTextField('spryTextfieldWidget_src', 'custom', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_title', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});

</script>

