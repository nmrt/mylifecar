

<?php

session_start();

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
include 'variables.php';
$_page = 'model';
$_minUnits = ($x=$_SESSION['model']['extended']['news']['minUnits']) ? $x : 5;
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
// save, edit, delete reports
//
include 'operation.reports.php';

//
// add item
//
if($_SESSION['user'])
{
	
	?>
	<div class="conversationHead pointer"
	onmouseover="this.style.backgroundColor='#ffffcc';"
	onmouseout="this.style.backgroundColor='white';"
	onclick=
	"
		var $o =
		{
			'class'		: 'conversationManager',
			'name'		: '<?php echo urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['conversation']['add'][0]); ?>',
			'body'		: '<?php echo urlencode('window/model/conversation/manager.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				createIframe('conversationManager');
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
	<?php echo $Vars->page['body']['conversation']['add'][0]; ?>
	</td>
	</tr>
	</table>
	</div>
	<?php
	
}

//
// NOT logged in
//
else
{
	echo '<div style="padding:10px;">';
	echo $Vars->page['body']['conversation']['must_login'][0];
	echo '<table border="0" cellspacing="0" cellpadding="2" style="margin-top:5px;">';
	echo '<tr>';
	$a = array('login.form','signin.form');
	foreach($a as $v)
	{
		
		$pv = $v;
		if($x=strrpos($v,'.')) { $pv = substr($v,0,$x); }
		switch($v)
		{
			default: $c = ''; break;
			case 'login.form':
				$c = '&amp;continue='.urlencode("$_SERVER[PHP_SELF]?$_SERVER[QUERY_STRING]");
				break;
		}
		
		//
		// icon
		//
		echo '<td>';
		echo '<a href="/?page=user&amp;action='.$v.$c.'">';
		$_m = array('alt'=>$text[$pv]['button'][0]);
		echo img_png("img/ui/color/$pv.png", $_msie, array('_msie'=>$_m));
		echo '</a>';
		echo '</td>';
		
		//
		// text
		//
		echo '<td>';
		echo '<a href="/?page=user&amp;action='.$v.$c.'">';
		echo $text[$pv]['button'][0];
		echo '</a>';
		echo '</td>';
		
	}
	echo '</tr>';
	echo '</table>';
	echo '</div>';
}

$q = "SELECT * FROM conversation WHERE mid='$codeModelName' ORDER BY mts DESC";
$r = mysql_query($q, $_mysql['db']['main']);
if($_numRows=@mysql_num_rows($r))
{
	
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
		$mts = $row['mts'];
		$uid = $row['uid'];
		$title = $row['title'];
		$desc = $row['descrpt'];
		
		//
		// render
		//
		$src = "img/users/$_SESSION[lang]/color/64/$uid.png";
		if(!file_exists("$_SESSION[dr]/$src")) { $src = 'img/ui/color/64/no.image.png'; }
		$mt = filemtime("$_SESSION[dr]/$src");
		$imgs = getimagesize("$_SESSION[dr]/$src");
		$c = ($rowsZebra%2==0) ? '#fff' : '#eee';
		$_backRowColor = $c;
		$rowsZebra++;
		
		?>
		
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		
		<tr class="conversationHead">
		<td class="pointer"
		onclick=
		"
			var $x =  Node.getElementByClassName('\\bconversationHead\\b', this, {'direction':'reverse'}).parentNode;
			var $x = Node.getElementByClassName('\\bconversationDesc\\b', $x);
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
			<img
			src="/<?php echo "$src?mt=$mt"; ?>" <?php echo $imgs[3]; ?>
			alt="<?php echo $title; ?>" title="<?php echo $title; ?>" border="0" />
			</td>
			<td>
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td>
				<div class="user"><?php
				
				$q = "SELECT * FROM users WHERE id=$uid";
				$sqluserr = mysql_query($q, $_mysql['db']['main']);
				$sqluserrow = @mysql_fetch_assoc($sqluserr);
				$uname = ($sqluserrow['first_name'] && $sqluserrow['last_name'])
				? "$sqluserrow[first_name] $sqluserrow[last_name]"
				: $sqluserrow['nickname'];
				
				echo $Vars->page['body']['conversation']['user'][0].': '.$uname;
				
				?></div>
				<div class="title"><?php echo $title; ?></div>
				<div class="mts"><?php echo $Vars->page['body']['conversation']['mts'][0].': '.parseDate($mts); ?></div>
				</td>
				</tr>
				</table>
			</td>
			</tr>
			</table>
		</div>
		</td>
		<?php
		
		if($_edit && $_SESSION['user']['page']=='Administrator')
		{
			
			//
			// edit button
			//
			$onc =
			'
				var $o =
				{
					\'class\'		: \'conversationManager\',
					\'name\'		: \''.urlencode("$realCompanyName. $realModelName. ".$Vars->page['body']['conversation']['edit'][0]).'\',
					\'body\'		: \''.urlencode('window/model/conversation/manager.php').'\',
					\'include\'		: true,
					\'callback\'	: function($el)
					{
						createIframe(\'conversationManager\');
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
					'alt'=>$Vars->page['body']['conversation']['edit'][0],
					'title'=>$Vars->page['body']['conversation']['edit'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['conversation']['edit'][0],
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
				if(confirm(\''.$Vars->page['body']['conversation']['delete']['confirm'][0].'\'))
				{
					var $get =
					[
						\'block=conversation\',
						\'id='.$id.'\'
					];
					XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/delete.php?\'+$get.join(\'&amp;\'),
					{\'container\':ID(\'pool\'), \'xml\':false, \'callback\':
					function()
					{
						var $n = ID(\'conversation\');
						var $core = Node.getElementByClassName(\'\\\\bcore\\\\b\', $n);
						var $padd = Node.getElementByClassName(\'\\\\bpadding\\\\b\', $core);
						var $get =
						[
							\'model='.$codeModelName.'\',
							\'deleteError=\'+$_conversationDeleteError
						];
						XMLHttp.load(\'http://'.$_SERVER['HTTP_HOST'].'/php/script/model/conversation.php?\'+$get.join(\'&amp;\'),
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
					'alt'=>$Vars->page['body']['conversation']['delete'][0],
					'title'=>$Vars->page['body']['conversation']['delete'][0],
					'border'=>'0',
					'onclick'=>$onc,
					'style'=>$style
				),
				'msie' => array
				(
					'class' => $class,
					'title'=>$Vars->page['body']['conversation']['delete'][0],
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
		<div class="conversationDesc serif" style="display:none; background-color:<?php echo $c; ?>;"><div style="padding:6px;">
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
	if($_numRows>$_minUnits && !$_SESSION['model']['extended']['conversation'])
	{
		
		$get = array
		(
			'page=model',
			'extended_block=conversation',
			"model=$codeModelName"
		);
		echo '<div class="archive" align="right">';
		echo '<a href="/?'.join('&amp;',$get).'">';
		echo $Vars->page['body']['conversation']['archive'][0];
		echo '</a>';
		echo '</div>';
		
	}
	
	//
	// controls in extended mode
	//
	if($_SESSION['model']['extended']['conversation'])
	{
		$get = array
		(
			'get='.urlencode("page=model&amp;extended_block=conversation&amp;model=$codeModelName"),
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
	<?php echo $Vars->page['body']['empty_block']['sg'][0].' '.$Vars->page['body']['conversation']['head'][0]; ?>.
	</div>
	<?php
}

//
// mysql close
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

