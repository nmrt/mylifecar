

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
include 'variables.php';
$_page = 'model';
$_sesext = $_SESSION['model']['extended']['photos'];
$_minUnits = ($x=$_sesext['minUnits']) ? $x : 3;
$_startUnits = ($x=$_sesext['startUnits']) ? $x : 0;
$_dop = 10;

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/script/img/png.php";

//
// classes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();
include_once "$_SESSION[dr]/php/class/Vars.php";
if(!$Vars)
{
	$Vars = new Vars();
	$Vars->init();
}

//
// save, edit, delete reports
//
include 'operation.reports.php';

//
// add photo
//
if($_edit)
{
	
	?>
	<div class="pointer"
	onmouseover="this.style.backgroundColor='#ffffcc';"
	onmouseout="this.style.backgroundColor='#fff';"
	onclick=
	"
		var $o =
		{
			'class'		: 'photosManager',
			'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['photos']['add'][0]); ?>',
			'body'		: '<?php echo urlencode('window/model/photos/manager.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				createIframe('photosManager');
			},
			'bodyOpts'	:
			{
				'model'		: '<?php echo $codeModelName; ?>',
				'type'		: 'add'
			}
		}
		Window.addInstance($o);
	"
	>
	<table width="100%" border="0" cellspacing="0" cellpadding="6">
	<tr>
	<td><img src="/img/ui/color/64/add.png" alt="add" border="0" /></td>
	<td width="100%" class="title">
	<?php echo $Vars->page['body']['photos']['add'][0]; ?>
	</td>
	</tr>
	</table>
	</div>
	<?php
	
}

//
// mysql query
//
$q = "SELECT * FROM photos WHERE model='$codeModelName' ORDER BY id DESC";
$r = mysql_query($q, $_mysql['db']['main']);

if($_numRows=@mysql_num_rows($r))
{
	
	//
	// search ID
	//
	if($_GET['searchID'])
	{
		$i=0; while($sqlrow=@mysql_fetch_assoc($r))
		{
			if($sqlrow['id']==$_GET['searchID'])
			{
				$_startUnits = $i;
				break;
			}
			$i++;
		}
	}
	
	$_nop = ceil($_numRows/$_minUnits);
	if(!@mysql_data_seek($r, $_startUnits))
	{
		$_startUnits = $_nop-1;
		mysql_data_seek($r, $_startUnits);
	}
	$_endUnits = min($_startUnits+$_minUnits, $_numRows);
	$rowsZebra = 0;
	$chessZebra = 0;
	
	//
	// render photos
	//
	for($i=$_startUnits; $i<$_endUnits; $i++)
	{
		
		//
		// mysql row
		//
		$row = mysql_fetch_assoc($r);
		$id = $row['id'];
		$title = $row['title'];
		
		//
		// render photos
		//
		$src = "img/model/$_SESSION[lang]/photos/color/64/$id.png";
		if(!file_exists("$_SESSION[dr]/$src"))
		{
			//$abssrc = urlencode("$_SESSION[dr]/img/ui/no.image.png");
			$src = 'img/ui/color/64/no.image.png';
			$imgheight = 64;
		}
		else
		{
			//$abssrc = urlencode($abssrc);
			$imgheight = 48;
		}
		$mt = filemtime("$_SESSION[dr]/$src");
		$imgs = getimagesize("$_SESSION[dr]/$src");
		if(!$_sesext) { $c = ($rowsZebra%2==0) ? '#fff' : '#eee'; }
		else
		{
			$c = ($chessZebra%2==0) ? '#fff' : '#eee';
			if($rowsZebra%2==0) { $chessZebra++; }
		}
		$_backRowColor = $c;
		$rowsZebra++;
		
		?>
		<div style=" <?php echo ($_sesext?'width:50%; float:left;':''); ?>">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr class="photoTR">
		<td>
		<div class="pointer" style="background-color:<?php echo $c; ?>;"
		onmouseover="this.style.backgroundColor='#ffffcc';"
		onmouseout="this.style.backgroundColor='<?php echo $c; ?>';"
		onclick=
		"
			var $o =
			{
				'class'		: 'photosViewer',
				'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['photos']['head'][0]); ?>',
				'body'		: '<?php echo urlencode('window/model/photos.php'); ?>',
				'include'	: true,
				'bodyOpts'	:
				{
					'model'		: '<?php echo $codeModelName; ?>',
					'id'		: <?php echo $id; ?>
				}
			}
			Window.addInstance($o);
		"
		>
			<table width="100%" border="0" cellspacing="0" cellpadding="6">
			<tr>
			<td width="64">
			<img
			src="/<?php echo "$src?mt=$mt"; ?>"
			<?php echo $imgs[3]; ?>
			alt="<?php echo $title; ?>"
			title="<?php echo $title; ?>"
			border="0"
			/>
			</td>
			<td class="title">
			<?php echo $title; ?>
			</td>
			</tr>
			</table>
		</div>
		</td>
		<?php
		
		if($_edit)
		{
			
			//
			// edit button
			//
			$onc =
			'
				var $o =
				{
					\'class\'		: \'photosManager\',
					\'name\'		: \''.urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['photos']['edit'][0]).'\',
					\'body\'		: \''.urlencode('window/model/photos/manager.php').'\',
					\'include\'		: true,
					\'callback\'	: function($el)
					{
						createIframe(\'photosManager\');
					},
					\'bodyOpts\'	:
					{
						\'model\'		: \''.$codeModelName.'\',
						\'type\'		: \'edit\'
					}
				}
				var $post =
				{
					\'id\'			: '.$id.'
				}
				Window.addInstance($o, $post);
			';
			$class = 'pointer';
			$style = 'margin-left:2px;';
			$a = array
			(
				'_msie' => array
				(
					'class' => $class,
					'alt'=>$Vars->page['body']['photos']['edit'][0],
					'title'=>$Vars->page['body']['photos']['edit'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['photos']['edit'][0],
					'onclick'=>$onc,
					'style'=>$style
				)
			);
			echo '<td width="1" style="background-color:'.$_backRowColor.';">';
			echo img_png('img/ui/color/edit.png', $_msie, $a);
			echo '</td>';
			
			//
			// delete button
			//
			$onc =
			'
				if(confirm(\''.$Vars->page['body']['photos']['delete']['confirm'][0].'\'))
				{
					var $get =
					[
						\'block=photos\',
						\'id='.$id.'\'
					];
					XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/delete.php?\'+$get.join(\'&amp;\'),
					{\'container\':this.parentNode, \'xml\':false, \'callback\':
					function()
					{
						var $photos = document.getElementById(\'photos\');
						var $core = Node.getElementByClassName(\'\\\\bcore\\\\b\', $photos);
						var $padd = Node.getElementByClassName(\'\\\\bpadding\\\\b\', $core);
						var $get =
						[
							\'model='.$codeModelName.'\',
							\'deleteError=\'+$_photosDeleteError
						];
						XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/photos.php?\'+$get.join(\'&amp;\'),
						{\'container\':$padd, \'xml\':false, \'callback\':function(){AppearFades($padd);}});
					}
					});
				}
			';
			$class = 'pointer';
			$style = 'margin: 0 2px;';
			$a = array
			(
				'_msie' => array
				(
					'class' => $class,
					'alt'=>$Vars->page['body']['photos']['delete'][0],
					'title'=>$Vars->page['body']['photos']['delete'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['photos']['delete'][0],
					'onclick'=>$onc,
					'style'=>$style
				)
			);
			echo '<td width="1" style="background-color:'.$_backRowColor.';">';
			echo img_png('img/ui/color/delete.png', $_msie, $a);
			echo '</td>';
			
		}
		
		?>
		</tr>
		</table>
		</div>
		<?php
		
	}
	
	//
	// photos archive
	//
	if($_numRows>$_minUnits && !$_sesext)
	{
		
		$get = array
		(
			'page=model',
			'extended_block=photos',
			"model=$codeModelName"
		);
		echo '<div class="archive" align="right">';
		echo '<a href="/?'.join('&amp;',$get).'">';
		echo $Vars->page['body']['photos']['archive'][0];
		echo '</a>';
		echo '</div>';
		
	}
	
	//
	// controls in extended mode
	//
	if($_SESSION['model']['extended']['photos'])
	{
		$get = array
		(
			'get='.urlencode("page=model&amp;extended_block=photos&amp;model=$codeModelName"),
			"lang=$_SESSION[lang]",
			"numRows=$_numRows",
			"minUnits=$_minUnits",
			"startUnits=$_startUnits",
			"endUnits=$_endUnits",
			"dop=$_dop"
		);
		$ch = curl_init("http://$_SESSION[repository]/php/script/page.controls.php?".join('&', $get));
		curl_exec($ch);
		curl_close($ch);
	}
	
} // if there are photos

else
{
	?>
	<div class="empty">
	<?php echo $Vars->page['body']['empty_block']['pl'][0].' '.$Vars->page['body']['photos']['head'][0]; ?>.
	</div>
	<?php
}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

