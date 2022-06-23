

<?php

session_start();

//
// includes
//
include "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include "$_SESSION[dr]/php/script/mysql/connect.php";

//
// variables
//
$_o = $_GET['o'];
$_id = $_o['id'];
$company = $_o['company'];
$model = $_o['model'];

//
// mysql query
//
$q = "SELECT * FROM photos WHERE model='$model' ORDER BY id DESC";
$r = mysql_query($q, $_mysql['db']['main']);

if($_numRows=@mysql_num_rows($r))
{
	
	echo '<table border="0" cellspacing="0" cellpadding="6">';
	
	//
	// mysql rows
	//
	$_rows = array();
	for($i=0; $i<$_numRows; $i++)
	{
		$row = mysql_fetch_assoc($r);
		if($row['id']==$_id)
		{
			$_rows[1] = $row;
			if(@mysql_data_seek($r, $i-1))
			{
				$row = mysql_fetch_assoc($r);
				$_rows[0] = $row;
			}
			else { $_rows[0] = NULL; }
			if(@mysql_data_seek($r, $i+1))
			{
				$row = @mysql_fetch_assoc($r);
				$_rows[2] = $row;
			}
			else { $_rows[2] = NULL; }
			break;
		}
	}
	
	//
	// images
	//
	echo '<tr>';
	for($i=0; $i<count($_rows); $i++)
	{
		
		$row = $_rows[$i];
		
		ob_start();
		?>
		onclick=
		"
			var $win = Node.getElementByClassName('\\bwindow\\s+photosViewer\\b');
			var $core = Node.getElementByClassName('\\bcore\\b', $win);
			var $scroll = Node.getElementByClassName('\\bscroll\\b', $core);
			var $get =
			[
				'o[model]=<?php echo $model; ?>',
				'o[id]=<?php echo $row['id']; ?>'
			];
			XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/window/model/photos.php?'+$get.join('&amp;'),
			{'container':$scroll, 'xml':false, 'callback':function(){AppearFades($core);}});
		"
		<?php
		$onclick = ob_get_clean();
		
		switch($i)
		{
			
			case 0:
				
				//
				// left image
				//
				echo '<td width="70">';
				if($row)
				{
					$src = "img/model/$_SESSION[lang]/photos/color/64/$row[id].png";
					if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/color/64/no.image.png'; }
					$mt = filemtime("$_SESSION[dr]/$src");
					?>
					<img
					src="/<?php echo "$src?mt=$mt"; ?>"
					class="AppearFade leftImage pointer"
					alt="<?php echo $row['title']; ?>"
					title="<?php echo $row['title']; ?>"
					border="0"
					style="visibility:hidden; border: 1px solid #eee;"
					onmouseover="this.style.borderColor='red';"
					onmouseout="this.style.borderColor='#eee';"
					<?php echo $onclick; ?>
					/>
					<?php
				}
				echo '</td>';
				
				break;
			
			case 1:
				
				//
				// center image
				//
				$src = "img/model/$_SESSION[lang]/photos/$row[id].png";
				if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/no.image.png'; }
				$mt = filemtime("$_SESSION[dr]/$src");
				$imgs = getimagesize("$_SESSION[dr]/$src");
				echo '<td>';
				?>
				<img <?php echo $imgs[3]; ?>
				src="/<?php echo "$src?mt=$mt"; ?>"
				class="AppearFade centerImage"
				alt="<?php echo $row['title']; ?>"
				title="<?php echo $row['title']; ?>"
				border="0"
				style="visibility:hidden; border: 2px solid #eee;"
				/>
				<?php
				echo '</td>';
				
				break;
			
			case 2:
				
				//
				// right image
				//
				echo '<td width="70">';
				if($row)
				{
					$src = "img/model/$_SESSION[lang]/photos/color/64/$row[id].png";
					if(!is_file("$_SESSION[dr]/$src")) { $src = 'img/ui/color/64/no.image.png'; }
					$mt = filemtime("$_SESSION[dr]/$src");
					?>
					<img
					src="/<?php echo "$src?mt=$mt"; ?>"
					class="AppearFade rightImage pointer"
					alt="<?php echo $row['title']; ?>"
					title="<?php echo $row['title']; ?>"
					border="0"
					style="visibility:hidden; border: 1px solid #eee;"
					onmouseover="this.style.borderColor='red';"
					onmouseout="this.style.borderColor='#eee';"
					<?php echo $onclick; ?>
					/>
					<?php
				}
				echo '</td>';
				
				break;
			
		}
		
	}
	echo '</tr>';
	
	//
	// title & description
	//
	echo '<tr>';
	for($i=0; $i<count($_rows); $i++)
	{
		
		$row = $_rows[$i];
		
		switch($i)
		{
			
			case 0: echo '<td></td>'; break;
			
			case 1:
				
				//
				// parse current model photos xml
				//
				$desc = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/model/photos/$row[id].xml");
				$desc = $XML->toArray($desc->tagChildren);
				$desc = $desc['desc'][0];
				
				if(!$imgs=@getimagesize("$_SESSION[dr]/img/model/photos/$row[id].png"))
				{
					$imgs = getimagesize("$_SESSION[dr]/img/ui/no.image.png");
				}
				
				echo '<td class="text">';
				?>
				<h6 class="title AppearFade" style="width:<?php echo (($x=$imgs[0])?"{$x}px":'auto'); ?>; visibility:hidden; background-color:white;">
				<?php echo $row['title']; ?>
				</h6>
				<div class="description serif AppearFade" style="width:<?php echo (($x=$imgs[0])?"{$x}px":'auto'); ?>; visibility:hidden; background-color:white;">
				<?php echo $desc; ?>
				</div>
				<?php
				echo '</td>';
				
				break;
			
			case 2: echo '<td></td>'; break;
			
		}
		
	}
	echo '</tr>';
	
	echo '</table>';
	
}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?> 




