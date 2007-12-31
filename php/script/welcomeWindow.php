

<?php

session_start();

//
// classes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

//
// xml
//
$_wwxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/welcomeWindow.xml");
$_wwxml = $XML->toArray($_wwxml->tagChildren);

//
// force
//
$_force = $_GET['force'] ? true : false;
if(!isset($_COOKIE['showWelcomeWindow'])) { $_force = true; }

if($_COOKIE['showWelcomeWindow'] || $_force)
{
	
	?>
	
	<!--
	//
	// welcomeWindow
	//
	-->
	<div id="welcomeWindowBlackVeil" class="BlackVeil" style="z-index:999999999;"></div>
	<div id="welcomeWindowBorder" style="z-index:999999999;"></div>
	<div id="welcomeWindow" style="z-index:999999999;">
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td id="welcomeWindowHead" class="head">
		<table width="100%" border="0" cellspacing="0" cellpadding="5">
		<tr>
		<td class="title" width="100%"><?php echo $_wwxml['title'][0]; ?></td>
		<td class="x" onclick="closeWelcomeWindow()">X</td>
		</tr>
		</table>
	</td>
	</tr>
	<tr>
	<td>
	<div id="welcomeWindowScroll" class="scroll"><div class="padding">
	
	<?php
	
	//
	// image
	//
	$f = "img/1-1-1.$_SESSION[lang].jpg";
	$mt = filemtime("$_SERVER[DOCUMENT_ROOT]/$f");
	$imgs = getimagesize("$_SERVER[DOCUMENT_ROOT]/$f");
	echo '<img src="/'.$f.'" '.$imgs[3].' alt="1-1-1" border="0" />';
	
	echo '<div style="width:'.$imgs[0].'px;">';
	
	//
	// hello paragraph
	//
	echo '<p>';
	echo $_wwxml['hello'][0];
	echo '</p>';
	
	//
	// first paragraph
	//
	echo '<p>';
	echo $_wwxml['text'][0];
	echo '</p>';
	
	//
	// second paragraph
	//
	echo '<div style="margin: 10px 0">';
	echo $_wwxml['text2'][0];
	echo '</div>';
	
	//
	// links
	//
	echo '<div align="right" style="margin-top:20px">';
	echo '<a href="/?page=help" class="typeB" onclick="setShowWelcomeWindowCookie()">';
	echo $_wwxml['help'][0];
	echo '</a>';
	echo '<br/>';
	echo '<a href="/?page=model&amp;model=1" class="typeB" onclick="setShowWelcomeWindowCookie()">';
	echo $_wwxml['first_page'][0];
	echo '</a>';
	echo '</div>';
	
	echo '</div>';
	
	?>
	
	</div></div>
	</td>
	</tr>
	<tr>
	<td id="welcomeWindowFoot" class="foot" style="padding:5px;">
		<table border="0" cellspacing="0" cellpadding="0">
		<tr>
		<td>
		<?php $chckd = (!$_COOKIE['showWelcomeWindow']) ? ' checked="checked"' : ''; ?>
		<input type="checkbox" id="dont_show_welcomeWindow_cb"<?php echo $chckd; ?>
		onclick="setShowWelcomeWindowCookie()"
		/>
		</td>
		<td style="padding-left:5px;"><label for="dont_show_welcomeWindow_cb"><?php echo $_wwxml['dont_show'][0]; ?></label></td>
		</tr>
		</table>
	</td>
	</tr>
	</table>
	</div>
	
	<script language="javascript" type="text/javascript">
	
	//
	// place function
	//
	placeWelcomeWindow = function()
	{
		
		var $de = document.documentElement;
		
		//
		// place BlackVeil
		//
		var $BlackVeil = document.getElementById('welcomeWindowBlackVeil');
		$BlackVeil.style.width = $de.offsetWidth+'px';
		$BlackVeil.style.height = $de.offsetHeight+'px';
		
		//
		// place welcomeWindow
		//
		var $welcomeWindow = document.getElementById('welcomeWindow');
		var $head = document.getElementById('welcomeWindowHead');
		var $scroll = document.getElementById('welcomeWindowScroll');
		var $foot = document.getElementById('welcomeWindowFoot');
		$scroll.style.height = 'auto';
		$scroll.style.width = 'auto';
		if($welcomeWindow.offsetHeight>($de.offsetHeight-20))
		{
			var $height = $de.offsetHeight-$head.offsetHeight-$foot.offsetHeight-20;
			$scroll.style.height = $height+'px';
		}
		if($welcomeWindow.offsetWidth>($de.offsetWidth-20)) { $scroll.style.width = $de.offsetWidth-20+'px'; }
		$welcomeWindow.style.left = (($de.offsetWidth-$welcomeWindow.offsetWidth)/2)+'px';
		$welcomeWindow.style.top = (($de.offsetHeight-$welcomeWindow.offsetHeight)/2)+'px';
		
		//
		// place welcomeWindowBorder
		//
		var $welcomeWindowBorder = document.getElementById('welcomeWindowBorder');
		$welcomeWindowBorder.style.left = $welcomeWindow.offsetLeft-10+'px';
		$welcomeWindowBorder.style.top = $welcomeWindow.offsetTop-10+'px';
		$welcomeWindowBorder.style.width = $welcomeWindow.offsetWidth+20+'px';
		$welcomeWindowBorder.style.height = $welcomeWindow.offsetHeight+20+'px';
		
	}
	
	//
	// close function
	//
	closeWelcomeWindow = function()
	{
		
		//
		// set cookie
		//
		setShowWelcomeWindowCookie();
		
		//
		// DOM nodes deletion
		//
		var $BlackVeil = document.getElementById('welcomeWindowBlackVeil');
		var $welcomeWindowBorder = document.getElementById('welcomeWindowBorder');
		var $welcomeWindow = document.getElementById('welcomeWindow');
		$BlackVeil.parentNode.removeChild($BlackVeil);
		$welcomeWindowBorder.parentNode.removeChild($welcomeWindowBorder);
		$welcomeWindow.parentNode.removeChild($welcomeWindow);
		if(window.removeEventListener) { window.removeEventListener('resize', placeWelcomeWindow, true); }
		else if(window.detachEvent) { window.detachEvent('onresize', placeWelcomeWindow, true); }
		
	}
	
	//
	// close function
	//
	setShowWelcomeWindowCookie = function()
	{
		var $tr = document.getElementById('dont_show_welcomeWindow_cb').checked ? 0 : 1;
		var $exp = new Date();
		var $year = $exp.getTime()+(1000*60*60*24*366);
		$exp.setTime($year);
		document.cookie = 'showWelcomeWindow='+$tr+'; expires='+$exp.toGMTString()+'; path=/';
	}
	
	//
	// place it
	//
	placeWelcomeWindow();
	if(window.addEventListener) { window.addEventListener('resize', placeWelcomeWindow, true); }
	else if(window.attachEvent) { window.attachEvent('onresize', placeWelcomeWindow, true); }
	
	</script>

	<?php
	
}

?>
