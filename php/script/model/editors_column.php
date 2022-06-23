

<?php

$f = "xml/lang/$_SESSION[lang]/model/$dataBlockName/$codeModelName.xml";
	
//
// edit
//
if($_edit && $_SESSION['user']['page']=='Administrator')
{
	
	$get = array
	(
		'buttons=all',
		"iframe={$dataBlockName}Iframe",
		'lang='.$_SESSION['lang'],
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
	<div id="<?php echo $dataBlockName; ?>IframeForSale"><?php echo $xml['text'][0]; ?></div><button style="margin-top:10px;"
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
		var $con = this.nextSibling;
		$con.innerHTML = '';
		$con.style.display = 'inline';
		XMLHttp.loadNonXML
		(
			'php/script/model/save.php?'+$get.join('&amp;'),
			$con,
			$post,
			{
				hideContainer : true,
				hideContainerTimeout : 6000
			}
		);
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
	<?php echo $Vars->page['body']['empty_block']['sg'][0].' '.$Vars->page['body'][$dataBlockName]['data_provided'][0]; ?>.
	</div>
	<?php
}

?>

