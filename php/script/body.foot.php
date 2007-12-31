

<div align="right">
<table id="footMenu" border="0" cellspacing="0" cellpadding="0">
<tr>
<td>
<?php
$alt = array('alt'=>'left top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('/img/footMenu/lt.png', $_msie, $a);
?>
</td>
<td style="
<?php

$src = '/img/footMenu/st.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td>
<?php
$alt = array('alt'=>'right top corner');
$a = array
(
	'_msie' => $alt
);
echo img_png('/img/footMenu/rt.png', $_msie, $a);
?>
</td>
</tr>
<tr>
<td style="
<?php

$src = '/img/footMenu/sl.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
<td class="core" style="
<?php

$src = '/img/footMenu/s.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td class="cell">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<!--<a href="/?page=rss">-->
		<?php
		
		$a = array
		(
			'_msie' => array('alt'=>'rss')/*,
			'msie' => array('class'=>'pointer')*/
		);
		echo img_png('/img/ui/rss.png', $_msie, $a);
		
		?>
		<!--</a>-->
		</td>
		<?php
		
		switch($Vars->gSection['@name'])
		{
			case 'main':
				switch($Vars->section['@name'])
				{
					case 'index':
						switch($Vars->page['@name'])
						{
							case 'model':
								?>
								<td style="padding-left:5px;">
								<a href="http://<?php echo $_SERVER['HTTP_HOST']; ?>/rss/model?id=<?php echo $_GET['model']; ?>"
								target="_blank"><?php printf($_rssxml['model_feed'][0], "$realCompanyName $realModelName"); ?></a>
								</td>
								<?php
								break;
						}
						break;
				}
				break;
		}
		
		?>
		<td align="left" style="padding-left:5px;">
		<div><div class="footMenuSubItem" style="display:none;">
		<?php
		
		foreach($_rssxml['feeds'] as $k=>$v)
		{
			if(is_array($v))
			{
				echo '<div><a';
				echo ' href="http://'.$_SERVER['HTTP_HOST'].'/rss/'.$k.'"';
				echo ' target="_blank">';
				echo $v['title'][0];
				echo '</a></div>';
			}
		}
		
		?>
		</div></div><a class="footMenuItem js" href="javascript:void(null)"
		onclick="footMenuToggleSubItem(this)"><?php echo $_rssxml['feeds'][0]; ?></a>
		</td>
		</tr>
		</table>
	</td>
	<td class="cell">|</td>
	<td class="cell">
	<a href="javascript:void(null)" class="js"
	onclick=
	"
		var $con = Node.create('div', 1, {node:document.body})[0];
		XMLHttp.loadNonXML('php/script/welcomeWindow.php?force=true', $con);
	"
	><?php echo $_languagexml['foot']['show_welcome_window'][0]; ?></a>
	</td>
	<td class="cell">|</td>
	<td class="cell">
	<?php
	
	if($_SESSION['user'])
	{
	?>
		<a href="javascript:void(null)" class="js"
		onclick=
		"
			var $o =
			{
				'class'		: 'contactForm',
				'name'		: '<?php echo urlencode($_languagexml['foot']['contact_us'][0]); ?>',
				'body'		: '<?php echo urlencode('window/contact.php'); ?>',
				'include'	: true,
				'callback'	: function($el)
				{
					createIframe('contact');
				}
			}
			Window.addInstance($o);
		"
		>
	<?php
	}
	
	echo $_languagexml['foot']['contact_us'][0];
	if($_SESSION['user']) { ?></a><?php }
	else
	{
		ob_start();
		printf($_userxml['ui']['must_login_to_s'][0], $_languagexml['foot']['contact_us'][0]);
		$text = ob_get_clean();
		echo tip($text);
	}
	
	?>
	</td>
	<td class="cell">|</td>
	<td class="cell">
	<?php
	
	$year = (date('Y')>$_release['year']) ? $_release['year'].'-'.date('Y') : $_release['year'];
	echo "&copy;&nbsp;$year&nbsp;$_SESSION[dd]";
	
	?>
	</td>
	<!--<td class="cell">|</td>
	<td class="cell">
	<a href="http://users.skynet.be/mgueury/mozilla/" target="_blank">
	  <img src="http://users.skynet.be/mgueury/mozilla/tidy_16.gif"
	  alt="Validated by HTML Validator (based on Tidy)" height="16" width="39"/>
	</a>
	</td>-->
	</tr>
	</table>
</td>
<td style="
<?php

$src = '/img/footMenu/sr.png';
if(!$_msie) { echo 'background-image:url('.$src.');'; }
else { echo 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''.$src.'\', sizingMethod=\'scale\');'; }

?>
"></td>
</tr>
</table>
</div>

