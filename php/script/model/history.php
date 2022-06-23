

<?php

$f = "xml/lang/$_SESSION[lang]/model/history/$codeModelName.xml";
	
//
// edit
//
if($_edit)
{
	
	$get = array
	(
		'buttons=all',
		'iframe=historyIframe',
		'lang='.$Vars->language['@name'],
		'sitemap='.urlencode("http://$_SERVER[HTTP_HOST]/php/script/site.map.php"),
		'dir='.urlencode("$_SESSION[dr]/img/users/{$_SESSION[user][id]}")
	);
	$ch = curl_init("http://$_repository/php/script/Selection.menu.php?".join('&',$get));
	curl_exec($ch);
	curl_close($ch);
	if(file_exists($f))
	{
		$xml = $XML->parse($f);
		$xml = $XML->toArray($xml->tagChildren);
	}
	else { $xml = array(); }
	?>
	<div id="historyIframeForSale"><?php echo $xml['text'][0]; ?></div><button style="margin-top:10px;"
	onclick=
	"
		var $get =
		[
			'block=<?php echo $dataBlockName; ?>'
		];
		var $text = this.previousSibling.contentWindow.document.body.innerHTML;
		var $text = $text.replace(/&amp;/g, '<amp/>');
		$post =
		{
			'text' : $text,
			'id' : '<?php echo $codeModelName; ?>'
		}
		XMLHttp.load('php/script/model/save.php?'+$get.join('&amp;'),
		{'xml':false, 'container':this.nextSibling, 'post':$post,
		'callback':function($el)
		{
			$_modelHistorySaveContainer = XMLHttp.containers.pop();
			setTimeout(function(){$_modelHistorySaveContainer.innerHTML=''}, 6000);
		}
		});
	"
	><?php echo $Vars->page['body']['edit']['save_btn'][0]; ?></button><span class="sansSerif">&nbsp;</span>
	<?php
	
}
else if(file_exists($f))
{
	$xml = $XML->parse($f);
	$xml = $XML->toArray($xml->tagChildren);
	echo '<div class="serif serifTD">'.$xml['text'][0].'</div>';
}
else
{
	?>
	<div class="empty">
	<?php echo $Vars->page['body']['empty_block']['sg'][0].' '.$Vars->page['body']['history']['head'][0]; ?>.
	</div>
	<?php
}

?>

