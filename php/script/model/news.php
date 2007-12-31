

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
include 'variables.php';
$_page = 'model';
$_minUnits = ($x=$_SESSION['model']['extended']['news']['minUnits']) ? $x : 3;
$_startUnits = ($x=$_SESSION['model']['extended']['news']['startUnits']) ? $x : 0;
$_dop = 10;

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/script/img/png.php";
include_once "$_SESSION[dr]/php/script/growingImage.php";
include_once "$_SESSION[dr]/php/script/parseDate.php";

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
// xml
//
$datexml = $XML->parse("http://$_SESSION[repository]/xml/lang/$_SESSION[lang]/date.xml");
$datexml = $XML->toArray($datexml->tagChildren);

//
// save, edit, delete reports
//
include 'operation.reports.php';

//
// show filter in exteded mode
//
if($_SESSION['model']['extended']['news'])
{
	
	echo '<div class="filter">';
	$filterxml = $Vars->page['body']['news']['extended']['filter'];
	echo $filterxml[0].': ';
	$date = $_SESSION['model']['extended']['news']['date'];
	if(!$date || $date=='all') { echo $filterxml['none'][0]; }
	if($date && $date!='all')
	{
		echo parseDate($date);
		$get = array
		(
			'page=model',
			'extended_block=news',
			"model=$codeModelName",
			'date=all'
		);
		echo ' <a href="/?'.join('&amp;',$get).'">';
		echo $filterxml['show_all'][0];
		echo '</a>';
	}
	echo '</div>';
	
}

//
// add new
//
if($_edit)
{
	
	?>
	<div class="newsHead pointer"
	onmouseover="this.style.backgroundColor='#ffffcc';"
	onmouseout="this.style.backgroundColor='white';"
	onclick=
	"
		var $o =
		{
			'class'		: 'newsManager',
			'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['news']['add'][0]); ?>',
			'body'		: '<?php echo urlencode('window/model/news/manager.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				createIframe('newsManager');
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
	<td width="100%">
	<?php echo $Vars->page['body']['news']['add'][0]; ?>
	</td>
	</tr>
	</table>
	</div>
	<?php
	
}

$q = "SELECT * FROM news WHERE model='$codeModelName'";
if(($date=$_SESSION['model']['extended']['news']['date']) && $date!='all') { $q .= " AND date='$date'"; }
$q .= " ORDER BY id DESC";
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
	
	for($i=$_startUnits; $i<$_endUnits; $i++)
	{
		
		//
		// mysql row
		//
		$row = mysql_fetch_assoc($r);
		$id = $row['id'];
		$date = $row['date'];
		$title = $row['title'];
		$source = $row['source'];
		$source_href = $row['source_href'];
		
		//
		// parse current model news
		//
		$file = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/model/news/$id.xml";
		$new = $XML->parse($file);
		$new = $XML->toArray($new->tagChildren);
		
		//
		// render news
		//
		$body = $new['body'][0];
		$src = "img/model/$_SESSION[lang]/news/color/64/$id.png";
		if(!file_exists("$_SESSION[dr]/$src"))
		{
			//$src = urlencode("$_SESSION[dr]/img/ui/no.image.png");
			$src = 'img/ui/color/64/no.image.png';
			$imgheight = 64;
		}
		else
		{
			//$src = urlencode($src);
			$imgheight = 48;
		}
		$mt = filemtime("$_SESSION[dr]/$src");
		$imgs = getimagesize("$_SESSION[dr]/$src");
		$c = ($rowsZebra%2==0) ? '#fff' : '#eee';
		$_backRowColor = $c;
		$rowsZebra++;
		
		?>
		
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		
		<tr class="newsHead">
		<td class="pointer">
		<div style="background-color:<?php echo $c; ?>;"
		onmouseover="this.style.backgroundColor='#ffffcc';"
		onmouseout="this.style.backgroundColor='<?php echo $c; ?>';"
		>
			<table width="100%" border="0" cellspacing="0" cellpadding="6">
			<tr>
			<td class="modelNewsPointer" width="64">
			<img class="modelNewsPointer"
			src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?>
			alt="<?php echo $title; ?>" title="<?php echo $title; ?>" border="0" />
			<?php
			
			/*growingImage
			(
				"newsImage$i",
				$src, $title,
				array(64,$imgheight), 0
			);*/
			
			?>
			</td>
			<td class="modelNewsPointer">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td class="modelNewsPointer">
				<div class="title modelNewsPointer"><?php echo $title; ?></div>
					<table class="data" border="0" cellspacing="0" cellpadding="0">
					<tr>
					<td class="modelNewsPointer"><?php echo $Vars->page['body']['news']['manager']['form']['date'][0].': '; ?></td>
					<td class="date modelNewsPointer" style="padding-left:2px;"><?php echo parseDate($date); ?></td>
					</tr>
					<tr>
					<td class="modelNewsPointer"><?php echo $Vars->page['body']['news']['manager']['form']['source'][0].': '; ?></td>
					<td class="source modelNewsPointer" style="padding-left:2px;"><?php
					
					
					if($source)
					{
						if($source_href) { echo '<a href="http://'.preg_replace("/(?i)^http:\/\//",'',$source_href).'" target="_blank">'; }
						echo $source;
						if($source_href) { echo '</a>'; }
					}
					else { echo '&nbsp;'; }
					
					?></td>
					</tr>
					</table>
				</td>
				</tr>
				</table>
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
					\'class\'		: \'newsManager\',
					\'name\'		: \''.urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['news']['edit'][0]).'\',
					\'body\'		: \''.urlencode('window/model/news/manager.php').'\',
					\'include\'		: true,
					\'callback\'	: function($el)
					{
						createIframe(\'newsManager\');
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
					'alt'=>$Vars->page['body']['news']['edit'][0],
					'title'=>$Vars->page['body']['news']['edit'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['news']['edit'][0],
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
			if($_SESSION['model']['extended']['news'])
			{
				$extonc =
				'
                    var $n = document.getElementById(\'calendar\');
                    var $core = Node.getElementByClassName(\'\\\\bcore\\\\b\', $n);
                    var $padd = Node.getElementByClassName(\'\\\\bpadding\\\\b\', $core);
					var $get =
					[
						\'model='.$codeModelName.'\'
					];
					XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/extended/news/calendar.php?\'+$get.join(\'&amp;\'),
					{\'container\':$padd, \'xml\':false, \'callback\':function(){MultiSelect.scan(arguments[0]);calendarNewsExtended.render();}});
				';
			}
			else { $extonc = ''; }
			$onc =
			'
				if(confirm(\''.$Vars->page['body']['news']['delete']['confirm'][0].'\'))
				{
					var $get =
					[
						\'block=news\',
						\'id='.$id.'\'
					];
					XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/delete.php?\'+$get.join(\'&amp;\'),
					{\'container\':this.parentNode, \'xml\':false, \'callback\':
					function()
					{
						var $news = document.getElementById(\'news\');
						var $core = Node.getElementByClassName(\'\\\\bcore\\\\b\', $news);
						var $padd = Node.getElementByClassName(\'\\\\bpadding\\\\b\', $core);
						var $get =
						[
							\'model='.$codeModelName.'\',
							\'deleteError=\'+$_newsDeleteError
						];
						XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/news.php?\'+$get.join(\'&amp;\'),
						{\'container\':$padd, \'xml\':false, \'callback\':function(){AppearFades($padd);}});
						'.$extonc.'
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
					'alt'=>$Vars->page['body']['news']['delete'][0],
					'title'=>$Vars->page['body']['news']['delete'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['news']['delete'][0],
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
		
		<tr>
		<td colspan="3">
		<div class="newsBody serif" style="display:none; background-color:<?php echo $c; ?>;"><div style="padding:6px;">
		<?php echo $body; ?>
		</div></div>
		</td>
		</tr>
		
		</table>
		
		<?php
		
	}
	
	//
	// news archive
	//
	if($_numRows>$_minUnits && !$_SESSION['model']['extended']['news'])
	{
		
		$get = array
		(
			'page=model',
			'extended_block=news',
			"model=$codeModelName"
		);
		echo '<div class="archive" align="right">';
		echo '<a href="/?'.join('&amp;',$get).'">';
		echo $Vars->page['body']['news']['archive'][0];
		echo '</a>';
		echo '</div>';
		
	}
	
	//
	// news controls in extended mode
	//
	if($_SESSION['model']['extended']['news'])
	{
		$get = array
		(
			'get='.urlencode("page=model&amp;extended_block=news&amp;model=$codeModelName"),
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
	
}
else
{
	?>
	<div class="empty">
	<?php echo $Vars->page['body']['empty_block']['pl'][0].' '.$Vars->page['body']['news']['head'][0]; ?>.
	</div>
	<?php
}

//
// mysql close
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

