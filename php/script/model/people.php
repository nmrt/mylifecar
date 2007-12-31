

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
include 'variables.php';
$_page = 'model';
$_minUnits = ($x=$_SESSION['model']['extended']['people']['minUnits']) ? $x : 3;
$_startUnits = ($x=$_SESSION['model']['extended']['people']['startUnits']) ? $x : 0;
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
// add one
//
if($_edit)
{
	
	?>
	<div class="peopleHead pointer"
	onmouseover="this.style.backgroundColor='#ffffcc';"
	onmouseout="this.style.backgroundColor='white';"
	onclick=
	"
		var $o =
		{
			'class'		: 'peopleManager',
			'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['people']['add'][0]); ?>',
			'body'		: '<?php echo urlencode('window/model/people/manager.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				createIframe('peopleManager');
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
	<?php echo $Vars->page['body']['people']['add'][0]; ?>
	</td>
	</tr>
	</table>
	</div>
	<?php
	
}

//
// mysql query
//
$q = "SELECT * FROM people WHERE model='$codeModelName' ORDER BY id DESC";
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
		$name = $row['name'];
		$sphere = (int)$row['sphere'];
		
		//
		// parse xml
		//
		$file = "$_SESSION[dr]/xml/lang/$_SESSION[lang]/model/people/$id.xml";
		$xml = $XML->parse($file);
		$xml = $XML->toArray($xml->tagChildren);
		
		//
		// render
		//
		$desc = $xml['desc'][0];
		$src = "img/model/$_SESSION[lang]/people/color/64/$id.png";
		if(!file_exists("$_SESSION[dr]/$src"))
		{
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
		
		<tr class="peopleHead">
		<td class="pointer"
		onclick=
		"
			var $x =  Node.getElementByClassName('\\bpeopleHead\\b', this, {'direction':'reverse'}).parentNode;
			var $x = Node.getElementByClassName('\\bpeopleDesc\\b', $x);
			Spry.Effect.Blind($x, {duration:200, from:'0%', to:'100%', toggle:true, setup:SpryEffectBlindOpenSetupFunc, finish:SpryEffectBlindOpenFinishFunc});
		"
		>
		<div style="background-color:<?php echo $c; ?>;"
		onmouseover="this.style.backgroundColor='#ffffcc';"
		onmouseout="this.style.backgroundColor='<?php echo $c; ?>';"
		>
			<table width="100%" border="0" cellspacing="0" cellpadding="6">
			<tr>
			<td width="64">
			<img class="img"
			src="/<?php echo "$src?mt=$mt"?>" <?php echo $imgs[3]; ?>
			alt="<?php echo $name; ?>" title="<?php echo $name; ?>" border="0" />
			</td>
			<td>
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td>
				<div class="name"><?php echo $name; ?></div>
				<div class="sansSerif" style="font-size:9px!important; font-weight:normal;">
				<?php echo $Vars->page['body']['people']['manager']['form']['sphere'][0].': '; ?>
				<span class="sphere">
				<?php
				
				$spherexml = $Vars->page['body']['people']['spheres']['sphere'];
				for($ii=0; $ii<$spherexml['%count']; $ii++)
				{
					if($ii==$sphere) { $echo = $spherexml[$ii][0]; break; }
				}
				echo $echo;
				
				?>
				</span>
				</div>
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
					\'class\'		: \'peopleManager\',
					\'name\'		: \''.urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['people']['edit'][0]).'\',
					\'body\'		: \''.urlencode('window/model/people/manager.php').'\',
					\'include\'		: true,
					\'callback\'	: function($el)
					{
						createIframe(\'peopleManager\');
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
					'alt'=>$Vars->page['body']['people']['edit'][0],
					'title'=>$Vars->page['body']['people']['edit'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['people']['edit'][0],
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
				if(confirm(\''.$Vars->page['body']['people']['delete']['confirm'][0].'\'))
				{
					var $get =
					[
						\'block=people\',
						\'id='.$id.'\'
					];
					XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/delete.php?\'+$get.join(\'&amp;\'),
					{\'container\':this.parentNode, \'xml\':false, \'callback\':
					function()
					{
						var $n = document.getElementById(\'people\');
						var $core = Node.getElementByClassName(\'\\\\bcore\\\\b\', $n);
						var $padd = Node.getElementByClassName(\'\\\\bpadding\\\\b\', $core);
						var $get =
						[
							\'model='.$codeModelName.'\',
							\'deleteError=\'+$_peopleDeleteError
						];
						XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/people.php?\'+$get.join(\'&amp;\'),
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
					'alt'=>$Vars->page['body']['people']['delete'][0],
					'title'=>$Vars->page['body']['people']['delete'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['people']['delete'][0],
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
		<div class="peopleDesc serif" style="display:none; background-color:<?php echo $c; ?>;"><div style="padding:6px;">
		<?php echo $desc; ?>
		</div></div>
		</td>
		</tr>
		
		</table>
		
		<?php
		
	}
	
	//
	// archive
	//
	if($_numRows>$_minUnits && !$_SESSION['model']['extended']['people'])
	{
		
		$get = array
		(
			'page=model',
			'extended_block=people',
			"model=$codeModelName"
		);
		echo '<div class="archive" align="right">';
		echo '<a href="/?'.join('&amp;',$get).'">';
		echo $Vars->page['body']['people']['archive'][0];
		echo '</a>';
		echo '</div>';
		
	}
	
	//
	// controls in extended mode
	//
	if($_SESSION['model']['extended']['people'])
	{
		$get = array
		(
			'get='.urlencode("page=model&amp;extended_block=people&amp;model=$codeModelName"),
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
	<?php echo $Vars->page['body']['empty_block']['pl'][0].' '.$Vars->page['body']['people']['head'][0]; ?>.
	</div>
	<?php
}

//
// mysql close
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

