

<div class="SiteMap">
<div class="SiteMapPadding">
<?php

//
// variables
//
$_dr = preg_replace("/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
include "$_dr/php/script/global.variables.php";
$_input = $_GET['input'];

//
// includes
//
include "$_dr/php/script/mysql/connect.php";
echo mysql_error();
include_once "$_dr/php/class/XML.php"; $XML = new XML();

//
// pages
//
$xml = $XML->parse("$_dr/xml/lang/$_lang/site.map.xml");
$xml = $XML->toArray($xml->tagChildren);
$menuxml = $XML->parse("$_dr/xml/lang/$_lang/menu.xml");
$menuxml = $XML->toArray($menuxml->tagChildren);
echo '<ul class="root group">';
echo '<li class="groupTitle">'.$xml['pages'][0].'</li>';
foreach($menuxml as $code=>$real)
{
	
	?>
	<li>
	<a href="javascript:void(null)" class="nobr"
	onmouseover="this.style.backgroundColor='#eee'"
	onmouseout="this.style.backgroundColor='#fff'"
	onclick=
	"
		var $get =
		[
			'page=<?php echo $code; ?>'
		];
		document.getElementById('<?php echo $_input; ?>').value = 'http://<?php echo $_SERVER['HTTP_HOST']; ?>/?'+$get.join('&');
	"
	><?php echo $real[0]; ?></a>
	</li>
	<?php
	
}
echo '</ul>';

//
// companies
//
$q = "SELECT * FROM info";
$r = mysql_query($q, $_mysql['db']['companies']);
echo '<ul class="root group">';
echo '<li class="groupTitle">'.$xml['companies'][0].'</li>';
while($row=@mysql_fetch_assoc($r))
{
	
	?>
	<li>
		<table class="company" border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td class="monospace" style="padding-right:2px;">
		<a href="javascript:void(null)" class="nobr"
		onmouseover="this.style.backgroundColor='#eee'"
		onmouseout="this.style.backgroundColor='#fff'"
		onclick=
		"
			var $xhtml = this.innerHTML;
			this.innerHTML = ($xhtml=='+') ? '-' : '+';
			var $company = Node.getElementByClassName('\\bcompany\\b', this, {'direction':'reverse'});
			var $models = Node.getElementByClassName('\\bmodels\\b', $company);
			var $display = $models.style.display;
			var $d = (!$_msie) ? 'table-cell' : 'inline';
			$models.style.display = ($display=='none') ? $d : 'none';
			if(!$models.innerHTML)
			{
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/site.map.models.php?company=<?php echo $row['id']; ?>&amp;input=<?php echo $_input; ?>',
				{'container':$models, 'xml':false});
			}
		"
		>+</a>
		</td>
		<td>
		<a href="javascript:void(null)" class="nobr"
		onmouseover="this.style.backgroundColor='#eee'"
		onmouseout="this.style.backgroundColor='#fff'"
		onclick=
		"
			var $get =
			[
				'page=company',
				'company=<?php echo $row['id']; ?>'
			];
			document.getElementById('<?php echo $_input; ?>').value = 'http://<?php echo $_SERVER['HTTP_HOST']; ?>/?'+$get.join('&');
		"
		><?php echo $row['realname']; ?></a>
		</td>
		</tr>
		<tr>
		<td></td>
		<td class="models" style="display:none;"></td>
		</tr>
		</table>
	</li>
	<?php
	
}
echo '</ul>';

?>
</div>
</div>

<?php

//
// end
//
include "$_dr/php/script/mysql/close.php";

?>

