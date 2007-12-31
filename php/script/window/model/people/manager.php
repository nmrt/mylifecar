

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
include_once "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/user/text.php";

//
// xml
//
$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$xml = $XML->toArray($xml->tagChildren);
$form = $xml['body']['people']['manager']['form'];
$tf = $_userxml['form'];
$ttfv = $_validatexml['text_field'];

//
// sql
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM people WHERE id=$_POST[id]";
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
$preview_image['block'] = 'people';
$preview_image['imgid'] = $_POST['id'];
$preview_image['form'] = 'peopleManagerForm';
include "$_SESSION[dr]/php/script/preview.image.form.php";

?>

<?php

$get = array
(
	'block=people'
);

?>
<form name="peopleManagerForm" method="post"
action="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/save.php?<?php echo join('&amp;', $get); ?>"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.peopleManagerForm))
	{
		var $desc = Node.getElementByName('desc', this);
		if($desc.contentWindow.document.body.innerHTML)
		{
			Event.submit(this, '', '', function()
			{
				var $n = document.getElementById('people');
				var $core = Node.getElementByClassName('\\bcore\\b', $n);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'model=<?php echo $model; ?>',
					'saveError='+$_peopleSaveError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/people.php?'+$get.join('&amp;'),
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
// name
//
-->
<tr>
<td class="nobr"><?php echo $form['name'][0]; ?></td>
<td>*</td>
<td>
<div id="spryTextfieldWidget_name">
<input type="text" name="form[name]" value="<?php echo $_sqlrow['name']; ?>" style="width:100%;" />
<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $maxChars" ?></span>
</div>
</td>
</tr>

<!--
//
// sphere
//
-->
<?php

$xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$xml = $XML->toArray($xml->tagChildren);
$spherexml = $xml['body']['people']['spheres']['sphere'];

?>
<tr>
<td class="nobr"><?php echo $form['sphere'][0]; ?></td>
<td></td>
<td>
<div id="spryTextfieldWidget_sphere">
<select class="MultiSelect" name="form[sphere]">
<?php

for($i=0; $i<$spherexml['%count']; $i++)
{
	$s = ($i==$_sqlrow['sphere']) ? ' selected="selected"' : '';
	echo '<option value="'.$i.'"'.$s.'>'.$spherexml[$i][0].'</option>';
}

?>
</select>
<!--<input type="text" name="sphere" value="<?php echo $_POST['sphere']; ?>" style="width:100%;" />-->
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
<td valign="top" class="descTD">*</td>
<td valign="top" class="descTD">
<?php
	
	$get = array
	(
		'buttons=all',
		'iframe=peopleManagerIframe',
		'lang='.$_SESSION['lang'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SERVER[DOCUMENT_ROOT]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	?>
	<div id="peopleManagerIframeForSale" class="desc"><?php
	
	$f = "$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/model/people/$_POST[id].xml";
	if($_POST['id'] && is_file($f))
	{
		$desc = $XML->parse($f);
		$desc = $XML->toArray($desc->tagChildren);
		echo $desc['desc'][0];
	}
	
	?>
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
value="<?php echo $xml['body']['edit']['save_btn'][0]; ?>"
/><span class="XMLHttpContainer"></span>
<?php echo $_userxml['form']['required'][0]; ?>
</td>
</tr>

</table>
</form>

<script type="text/javascript">

//new Spry.Widget.ValidationTextField('spryTextfieldWidget_img', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_name', 'custom', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_sphere', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});

</script>

<?php

//
// end
//
include_once "$_SESSION[dr]/php/script/mysql/close.php";

?>

