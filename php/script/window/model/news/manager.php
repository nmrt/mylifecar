

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
$form = $xml['body']['news']['manager']['form'];
$calendar = $form['date']['calendar'];
$tf = $_userxml['form'];
$ttfv = $_validatexml['text_field'];

//
// sql
//
include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
$q = "SELECT * FROM news WHERE id=$_POST[id]";
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
$preview_image['block'] = 'news';
$preview_image['imgid'] = $_POST['id'];
$preview_image['form'] = 'newsManagerForm';
include "$_SESSION[dr]/php/script/preview.image.form.php";

?>

<?php

$get = array
(
	'block=news'
);

?>
<form name="newsManagerForm" method="post"
action="http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/save.php?<?php echo join('&amp;', $get); ?>"
onsubmit=
"
	if(Spry.Widget.Form.onSubmit(this, document.newsManagerForm))
	{
		var $body = Node.getElementByName('body', this);
		if($body.contentWindow.document.body.innerHTML)
		{
			Event.submit(this, '', '', function()
			{
				var $news = document.getElementById('news');
				var $core = Node.getElementByClassName('\\bcore\\b', $news);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'model=<?php echo $model; ?>',
					'saveError='+$_newsSaveError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/news.php?'+$get.join('&amp;'),
				{'container':$padd, 'xml':false, 'callback':function(){AppearFades($padd);}});
				<?php if($_SESSION['model']['extended']['news']) { ?>
                    var $n = document.getElementById('calendar');
                    var $core = Node.getElementByClassName('\\bcore\\b', $n);
                    var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
					var $get =
					[
						'model=<?php echo $model; ?>'
					];
					XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/model/extended/news/calendar.php?'+$get.join('&amp;'),
					{'container':$padd, 'xml':false, 'callback':function(){MultiSelect.scan(arguments[0]);calendarNewsExtended.render();}});
				<?php } ?>
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
// date
//
-->
<tr>
<td class="nobr"><?php echo $form['date'][0]; ?></td>
<td>*</td>
<td>
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td>
	<div id="spryTextfieldWidget_date">
	<input id="newsManagerDateInput" type="text" name="form[date]" value="<?php echo (($x=$_sqlrow['date'])?$x:date('Y-m-d')); ?>" size="10" />
	<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
	<span class="textfieldInvalidFormatMsg"><?php echo $_validatexml['text_field']['invalid'][0] ?></span>
	</div>
	</td>
	<td style="padding-left:5px;">
	<?php $_calid = 'NewsManager'; ?>
	<input type="button" value="<?php echo $calendar['btn'][0]; ?>"
	onclick=
	"
		var $pc = document.getElementById('calendarNewsManagerPreContainer');
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
	<div id="calendarNewsManagerPreContainer" style="visibility:hidden;">
	<?php
	
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
	
	?>
	<div id="calendarNewsManagerContainer" style="position:absolute; margin-top:5px;"></div>
	<?php
	
	$q = array
	(
		"id=$_calid"
	);
	$ch = curl_init("$_SESSION[repository]/php/script/calendar/scripts.php?".join('&',$q));
	curl_exec($ch);
	curl_close($ch);
	
	$q = array
	(
		"lang=$_SESSION[lang]"
	);
	$ch = curl_init("$_SESSION[repository]/php/script/calendar/lang.php?".join('&',$q));
	curl_exec($ch);
	curl_close($ch);
	
	?>
	</div>
	<script type="text/javascript">
	
	calendar<?php echo $_calid; ?> = new YAHOO.widget.Calendar_lang('calendar<?php echo $_calid; ?>', 'calendar<?php echo $_calid; ?>Container');
	calendar<?php echo $_calid; ?>.onRender = calendar<?php echo $_calid; ?>OnRender;
	calendar<?php echo $_calid; ?>.render();
	calendar<?php echo $_calid; ?>.onSelect = function()
	{
		var $d = calendarOnSelect(calendar<?php echo $_calid; ?>);
		document.getElementById('newsManagerDateInput').value = $d[0]+'-'+$d[1]+'-'+$d[2];
		document.getElementById('calendar<?php echo $_calid; ?>PreContainer').style.display = 'none';
	}
	ID('calendar<?php echo $_calid; ?>').style.display = 'none';
	
	</script>
	</div>
	</td>
	</tr>
	</table>
</td>
</tr>

<!--
//
// title
//
-->
<tr>
<td class="nobr"><?php echo $form['title'][0]; ?></td>
<td>*</td>
<td>
<div id="spryTextfieldWidget_title">
<input type="text" name="form[title]" value="<?php echo $_sqlrow['title']; ?>" style="width:100%;" />
<span class="textfieldRequiredMsg"><?php echo $_validatexml['text_field']['required'][0]; ?></span>
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $maxChars" ?></span>
</div>
</td>
</tr>

<!--
//
// source
//
-->
<tr>
<td class="nobr"><?php echo $form['source'][0]; ?></td>
<td></td>
<td>
<div id="spryTextfieldWidget_source">
<input type="text" name="form[source]" value="<?php echo $_sqlrow['source']; ?>" style="width:100%;" />
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $maxChars" ?></span>
</div>
</td>
</tr>

<!--
//
// source_href
//
-->
<tr>
<td class="nobr"><?php echo $form['source_href'][0]; ?></td>
<td></td>
<td>
<div id="spryTextfieldWidget_source_href">
<input type="text" name="form[source_href]" value="<?php echo $_sqlrow['source_href']; ?>" style="width:100%;" />
<span class="textfieldMaxCharsMsg"><?php echo $_validatexml['text_field']['max_chars'][0]." $maxChars" ?></span>
</div>
</td>
</tr>

<!--
//
// body
//
-->
<tr>
<td valign="top" class="bodyTD nobr"><?php echo $form['body'][0]; ?></td>
<td valign="top" class="bodyTD">*</td>
<td valign="top" class="bodyTD">
<?php
	
	$get = array
	(
		'buttons=all',
		'iframe=newsManagerIframe',
		'lang='.$_SESSION['lang'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SERVER[DOCUMENT_ROOT]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_SESSION[repository]/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	?>
	<div id="newsManagerIframeForSale" class="body"><?php
	
	$f = "$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/model/news/$_POST[id].xml";
	if($_POST['id'] && is_file($f))
	{
		$body = $XML->parse($f);
		$body = $XML->toArray($body->tagChildren);
		echo $body['body'][0];
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

/*var imvf = function()
{
	var $im = document.newsManagerForm.img.value;
	if($im.match(/\.png$|\.jpg$|\.jpeg$/)) { return true; }
	else { return false; }
}*/

new Spry.Widget.ValidationTextField('spryTextfieldWidget_date', 'date', {'validateOn':'change', 'format':"yyyy-mm-dd", 'hint':"yyyy-mm-dd", 'useCharacterMasking':true});
//new Spry.Widget.ValidationTextField('spryTextfieldWidget_img', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>, 'validation':imvf});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_title', 'custom', {'validateOn':'change', 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_source', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>});
new Spry.Widget.ValidationTextField('spryTextfieldWidget_source_href', 'custom', {'validateOn':'change', 'isRequired':false, 'maxChars':<?php echo $maxChars ?>, hint:'example.com'});

</script>

