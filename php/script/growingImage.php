<?php

//
// inclusions
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include_once "$_SESSION[dr]/php/script/img/png.php";
include_once "$_SESSION[dr]/php/script/user/text.php";

function growingImage($id='', $src, $title='', $ssize, $dsize=0, $attrs=array(), $msie='', $direction=1)
{
	
	$id = "grimg$id".strtoupper(md5(uniqid(time(),true)));
	
	if(!is_file($src)) { $src = "$_SESSION[dr]/img/ui/no.image.png"; }
	if(!$msie) { $msie = $_SESSION['msie']; }
	if(!$dsize)
	{
		switch($direction)
		{
			case 1:
				$dsize = @getimagesize($src);
				$dsize = $dsize[0];
				break;
			case 0:
				$dsize = $ssize[0];
				break;
		}
	}
	
	//
	// src
	//
	$usrc = urlencode("$_SESSION[dr]$src");
	$ssrc = str_replace($_SESSION['dr'], '', $src);
	switch($direction)
	{
		case 1:
			$x = dirname($src)."/color/$ssize[0]/".basename($src);
			$mt = filemtime($x);
			$fsrc = str_replace($_SESSION['dr'], '', $x)."?mt=$mt";
			//$fsrc = "/php/script/img/resample.php?src=$usrc&amp;width=$ssize[0]&amp;height=$ssize[1]&amp;cache=".time();
			break;
		case 0:
			$mt = filemtime($src);
			$fsrc = "$ssrc?mt=$mt";
			break;
	}
	
	//
	// attrs
	//
	$class = 'pointer';
	switch($direction)
	{
		case 1: $class .= ' enl'; break;
		case 2: $class .= ' red'; break;
	}
	ob_start();
	?>
	var $img = top.ID('<?php echo $id; ?>');
	//var $txt = top.ID('<?php echo $id; ?>Txt');
	var $pm = top.ID('<?php echo $id; ?>pm');
	if($img.className.match(/\benl\b/))
	{
		$img.className = $img.className.replace(/\benl\b/, 'red');
		//$txt.innerHTML = '<?php echo $GLOBALS['_userlxml']['ui']['img']['enlarged'][0]; ?>';
		$pm.src = '/img/ui/grimgm.gif';
	}
	else
	{
		$img.className = $img.className.replace(/\bred\b/, 'enl');
		//$txt.innerHTML = '<?php echo $GLOBALS['_userlxml']['ui']['img']['reduced'][0]; ?>';
		$pm.src = '/img/ui/grimgp.gif';
	}
	$pm.style.display = 'none';
	Spry.Effect.GrowShrink
	(
		$img,
		{
			duration : 200,
			from : '100%',
			to : '<?php echo $dsize; ?>px',
			toggle : true,
			growCenter : false,
			finish : top.<?php echo $id; ?>Finish
		}
	);
	<?php
	$onclick = ob_get_clean();
	$a = array
	(
		'_msie' => array
		(
			'class' => $class,
			/*'width' => $ssize[0],
			'height' => $ssize[1],
			'alt' => $title,
			'title' => $title,
			'border' => '0',*/
			'onclick' => $onclick,
			'style' => 'border: 2px solid #eee;'
		),
		/*'msie' => array
		(
			'class' => $class,
			'title' => $title,
			'style' => ' width:'.$ssize[0].'px; height:'.$ssize[1].'px;',
			'onclick' => $onclick
		)*/
	);
	foreach($attrs as $k=>$v)
	{
		if(!$a['_msie'][$k]) { $a['_msie'][$k] = $v; }
		else { $a['_msie'][$k] .= " $v"; }
		/*if(!$a['msie'][$k]) { $a['msie'][$k] = $v; }
		else { $a['msie'][$k] .= " $v"; }*/
	}
	//echo img_png($fsrc, $msie, $a);
	?>
	
	<!--<div style="position:relative;">-->
	<table border="0" cellspacing="0" cellpadding="0">
	<tr>
	<td>
	
	<!--
	//
	// img
	//
	-->
	<?php
	echo '<img id="'.$id.'" src="'.$fsrc.'" border="0" alt="gimg"';
	foreach($a['_msie'] as $k=>$v)
	{
		echo " $k=\"$v\"";
	}
	echo ' />';
	?>
	
	<!--
	//
	// text
	//
	-->
	<!--<div id="<?php echo $id; ?>Txt" class="sec">
	<?php
	switch($direction)
	{
		case 1: $t = 'reduced'; break;
		case 2: $f = 'enlarged'; break;
	}
	echo $GLOBALS['_userlxml']['ui']['img'][$t][0];
	?>
	</div>-->
	
	<div align="right" style="margin-top:2px; font-size:0;">
	
	<!--
	//
	// plus, minus
	//
	-->
	<div> <!-- style="position:absolute; right:0; bottom:0;" -->
	<?php
	switch($direction)
	{
		case 1: $f = 'img/ui/grimgp.gif'; break;
		case 2: $f = 'img/ui/grimgm.gif'; break;
	}
	$imgmt = @filemtime($f);
	$imgs = @getimagesize($f);
	?>
	<img
		id="<?php echo $id; ?>pm" src="/<?php echo "$f?mt=$imgmt"; ?>"
		class="pointer"
		<?php echo $imgs[3]; ?>
		alt="pm"
		border="0"
		onclick="<?php echo $onclick; ?>"
	/>
	</div>
	
	<!--
	//
	// pimg
	//
	-->
	<!--<div id="<?php echo $id; ?>PimgBV" class="BlackVeil" style="display:none;"></div>-->
	<div id="<?php echo $id; ?>Pimg" style="display:none;"> <!-- position:absolute; -->
	<?php
	$f = "http://$_SESSION[repository]/img/preload.img.gif";
	$pimgmt = @filemtime($f);
	$pimgs = @getimagesize($f);
	?>
	<img src="<?php echo "$f?mt=$pimgmt"; ?>" <?php echo $pimgs[3]; ?> alt="pimg" border="0" />
	</div>
	
	</div>
	
	</td>
	</tr>
	</table>
	<!--</div>-->
	
	<script type="text/javascript" language="javascript">
	
	top.<?php echo $id; ?>Finish = function($el, $ef)
	{
		
		$el.style.position = 'static';
		
		//
		// img src
		//
		<?php
		
		switch($direction)
		{
			case 1:
				?>
				if($ef.direction==1) { var $src = '<?php
				$mt = filemtime($src);
				echo "$ssrc?mt=$mt";
				?>'; }
				if($ef.direction==2) { var $src = '<?php echo $fsrc; ?>'; }
				<?php
				break;
			case 0:
				?>
				if($ef.direction==1) { var $src = '<?php echo $fsrc; ?>'; }
				if($ef.direction==2) { var $src = '<?php
				$mt = filemtime($src);
				echo "$ssrc?mt=$mt";
				?>'; }
				<?php
				break;
		}
		
		?>
		
		//
		// pimg && pimgbv
		//
		setTimeout
		(
			function()
			{
				/*var $pimgbv = top.ID('<?php echo $id; ?>PimgBV');
				$pimgbv.style.display = 'block';
				$pimgbv.style.height = $el.offsetHeight+'px';
				$pimgbv.style.width = $el.offsetWidth+'px';
				$pimg.style.left = ($el.offsetWidth-$pimg.offsetWidth)/2+'px';
				$pimg.style.top = ($el.offsetHeight-$pimg.offsetHeight)/2+'px';*/
				var $pimg = top.ID('<?php echo $id; ?>Pimg');
				$pimg.style.display = 'block';
				$el.onload = function()
				{
					//var $pimgbv = top.ID('<?php echo $id; ?>PimgBV');
					var $pimg = top.ID('<?php echo $id; ?>Pimg');
					//$pimgbv.style.display = 'none';
					$pimg.style.display = 'none';
					top.ID('<?php echo $id; ?>pm').style.display = 'block';
				}
				$el.src = $src;
			}
			, 1
		);
		
		//
		// hide pimg && pimgbv img onload
		//
		/*Spry.Widget.Utils.addEventListener
		(
			$el, 'load',
			function()
			{
				var $pimgbv = top.ID('<?php echo $id; ?>PimgBV');
				var $pimg = top.ID('<?php echo $id; ?>Pimg');
				$pimgbv.style.display = 'none';
				$pimg.style.display = 'none';
			},
			true
		);*/
		
		/*if(!top.$_msie) { $el.src = $src; }
		else
		{
			var $f = $el.style.filter;
			$el.style.filter = $f.replace(/\bsrc='[^']+'/, "src='"+$src+"'");
		}*/
		
	}
	
	</script>
	<?php
	
}

?>