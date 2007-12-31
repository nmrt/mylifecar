<?php

session_start();

//
// target
//
$_targetpl = ($x=$_GET['target']) ? $x : 'models';
switch($_targetpl)
{
	case 'companies': $_targetsg = 'company'; break;
	case 'models': $_targetsg = 'model'; break;
	case 'users': $_targetsg = 'user'; break;
	case 'rss': $_targetsg = 'rss_item'; break;
	case 'ordered_models': $_targetsg = 'ordered_model'; break;
}

//
// session
//
$ses =& $_SESSION['AdministratorsControlPanel'][$_targetpl];
$a = array('minUnits','startUnits','order','orderDirection');
foreach($a as $v)
{
	if(isset($_GET[$v])) { $ses[$v] = $_GET[$v]; }
}
if(!$ses['minUnits']) { $ses['minUnits'] = 20; }
if(!$ses['order']) { $ses['order'] = 'id'; }
if(!$ses['orderDirection']) { $ses['orderDirection'] = 'DESC'; }

//
// variables
//
include "$_SESSION[dr]/php/script/global.variables.php";
$_session = $_SESSION['AdministratorsControlPanel'][$_targetpl];
$_minUnits = $_session['minUnits'];
$_startUnits = (int)$_session['startUnits'];
$_pageUnits = $_startUnits / $_minUnits + 1;
$_dop = 10;
$_order = $_session['order'];
$_orderDirection = $_session['orderDirection'];

//
// includes
//
include "$_SESSION[dr]/php/script/mysql/connect.php";
include_once "$_SESSION[dr]/php/script/img/png.php";

//
// classes
//
include_once "$_SESSION[dr]/php/class/XML.php"; $XML = new XML();

//
// xml
//
$_xml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/AdministratorsControlPanel.xml");
$_xml = $XML->toArray($_xml->tagChildren);
$_buttonsxml = $_xml['body']['buttons'];
$_alertsxml = $_xml['body']['alerts'];
$_companyxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/company.xml");
$_companyxml = $XML->toArray($_companyxml->tagChildren);
$_modelxml = $XML->parse("$_SESSION[dr]/xml/lang/$_SESSION[lang]/page/main/index/model.xml");
$_modelxml = $XML->toArray($_modelxml->tagChildren);

//
// operation reports
//
$id = 'operationReport';
if($_GET['saveError']=='true') { echo '<div id="'.$id.'" align="center" class="failure" style="margin:20px;">'.$_alertsxml['not_saved'][0]."</div>"; }
else if($_GET['saveError']=='false') { echo '<div id="'.$id.'" align="center" class="success" style="margin:20px;">'.$_alertsxml['saved'][0]."</div>";  }
else if($_GET['deleteError']=='true') { echo '<div id="'.$id.'" align="center" class="failure" style="margin:20px;">'.$_alertsxml['not_deleted'][0]."</div>"; }
else if($_GET['deleteError']=='false') { echo '<div id="'.$id.'" align="center" class="success" style="margin:20px;">'.$_alertsxml['deleted'][0]."</div>";  }
if(isset($_GET['saveError']) || isset($_GET['deleteError']))
{
	?>
	<script type="text/javascript">
	setTimeout
	(
		function()
		{
			var $n = ID('<?php echo $id; ?>');
			if($n) { $n.style.display = 'none'; }
		}
		, 10000
	);
	</script>
	<?php
}

//
// add target
//
switch($_targetpl)
{
	case 'companies':
	case 'models':
	case 'rss':
		?>
		<div class="pointer"
		onmouseover="this.style.backgroundColor='#ffffcc';"
		onmouseout="this.style.backgroundColor='#fff';"
		onclick=
		"
			var $o =
			{
				'class'		: 'mainManager',
				'name'		: '<?php echo urlencode($_buttonsxml['add'][0].' '.$_buttonsxml[$_targetsg][0]); ?>',
				'body'		: '<?php echo urlencode('window/AdministratorsControlPanel/main.manager.php'); ?>',
				'include'	: true,
				'callback'	: function($el)
				{
					MultiSelect.scan($el);
					<?php
					
					switch($_targetpl)
					{
						case 'companies':
						case 'rss':
							?> createIframe('mainManager'); <?php
							break;
					}
					
					?>
				},
				'bodyOpts'	:
				{
					'target' : '<?php echo $_targetsg; ?>'
				}
			}
			Window.addInstance($o);
		"
		>
		<table width="100%" border="0" cellspacing="0" cellpadding="6">
		<tr>
		<td><img src="php/script/img/resample.php?src=<?php echo urlencode("$_SESSION[dr]/img/ui/add.png"); ?>&amp;width=64&amp;height=64" alt="add" border="0" /></td>
		<td width="100%" style="font-weight:bold;">
		<?php echo $_buttonsxml['add'][0].' '.$_buttonsxml[$_targetsg][0]; ?>
		</td>
		</tr>
		</table>
		</div>
		<?php
	break;
}

//
// mysql query
//
switch($_targetpl)
{
	case 'companies':
	case 'models':
	case 'ordered_models':
		$dbpref = preg_replace("/\./", '', $_SESSION['dd']);
		switch($_targetpl)
		{
			case 'ordered_models': $sqltb = "{$dbpref}_models{$_SESSION[lang]}.ordered"; break;
			default: $sqltb = "{$dbpref}_{$_targetpl}{$_SESSION[lang]}.info"; break;
		}
		$q = "SELECT * FROM $sqltb ORDER BY";
		switch($_targetpl)
		{
			default: $q .= " $_order"; break;
			case 'models':
			case 'ordered_models':
				switch($_order)
				{
					default: $q .= " $_order"; break;
					case 'company':
						$q .= " (SELECT realname FROM {$dbpref}_companies{$_SESSION[lang]}.info WHERE id=$sqltb.$_order)";
						break;
					case 'uid':
						$q .= " (SELECT nickname FROM {$dbpref}_main{$_SESSION[lang]}.users WHERE id=$sqltb.$_order)";
						break;
				}
				break;
		}
		$q .= " $_orderDirection";
		$r = mysql_query($q);
		break;
	case 'users':
		$q = "SELECT * FROM $_targetpl ORDER BY $_order $_orderDirection";
		$r = mysql_query($q, $_mysql['db']['main']);
		break;
	case 'rss':
		$q = "SELECT * FROM rss_editor ORDER BY $_order $_orderDirection";
		$r = mysql_query($q, $_mysql['db']['main']);
		break;
}

if($_numRows=@mysql_num_rows($r))
{
	
	echo '<table class="list" width="100%" border="0" cellspacing="0" cellpadding="5">';

	//
	// head
	//
	$_numFields = mysql_num_fields($r);
	echo '<tr>';
	echo '<th style="border-bottom: 1px solid #666;"></th>';
	for($i=0; $i<$_numFields; $i++)
	{
		$type  = mysql_field_type($r, $i);
		$name  = mysql_field_name($r, $i);
		$len   = mysql_field_len($r, $i);
		$c = ($i%2==0) ? '#fff' : '#eee';
		$b = ($i>0) ? ' border-left: 1px solid #666;' : '';
		echo '<th style="'.$b.' border-bottom: 1px solid #666;">';
		$od = 'ASC';
		if($name==$_order) { $od = ($_orderDirection=='DESC') ? 'ASC' : 'DESC'; }
		if($name==$_order) { $o = ($_orderDirection=='DESC')
		? '<img src="img/ui/DESC.png" alt="DESC" border="0" style="margin-left:5px;" />'
		: '<img src="img/ui/ASC.png" alt="ASC" border="0" style="margin-left:5px;" />'; }
		else { $o = ''; }
		?>
			<table border="0" cellspacing="0" cellpadding="0">
			<tr>
			<td>
			<div style="overflow:hidden;">
			<a href="javascript:void(null)"
			style="color:#666; font-size:75%; font-weight:normal;"
			onclick=
			"
				var $n = document.getElementById('main.client');
				var $core = Node.getElementByClassName('\\bcore\\b', $n);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'target=<?php echo $_targetpl; ?>',
					'order=<?php echo $name; ?>',
					'orderDirection=<?php echo $od; ?>'
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/main.client.php?'+$get.join('&amp;'),
				{'container':$padd, 'xml':false, 'callback':function($el){ MultiSelect.scan($el); } });
			"
			><?php echo $name; ?></a>
			</div>
			</td>
			<td><?php echo $o; ?></td>
			</tr>
			</table>
		<?php
		echo '</th>';
	}
	echo '<th style="border-bottom: 1px solid #666;"></th>';
	echo '<th style="border-bottom: 1px solid #666;"></th>';
	echo '</tr>';
	
	//
	// body
	//
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
		// data
		//
		$row = mysql_fetch_assoc($r);
		$c = ($rowsZebra%2==0) ? '#fff' : '#eee';
		$rowsZebra++;
		
		//
		// render
		//
		echo '<tr style="background-color:'.$c.';">';
		
		//
		// onclick
		//
		ob_start();
		?>
		onclick=
		"
			var $x = this.parentNode.nextSibling;
			var $x = Node.getElementByClassName('\\bextended\\b', $x).firstChild;
			var $x = $x;
			if(!$x.innerHTML)
			{
				XMLHttp.load(
				'http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/extended/<?php echo $_targetsg; ?>.php?id=<?php echo $row['id']; ?>',
				{'container':$x, 'xml':false, 'callback':
				function($el)
				{
					Spry.Effect.Blind($el.parentNode,
					{duration:200, from:'0%', to:'100%', toggle:true,
					setup:SpryEffectBlindOpenSetupFunc, finish:SpryEffectBlindOpenFinishFunc});
				}
				});
			}
			else
			{
				Spry.Effect.Blind($x.parentNode,
				{duration:200, from:'0%', to:'100%', toggle:true,
				setup:SpryEffectBlindOpenSetupFunc, finish:SpryEffectBlindOpenFinishFunc});
			}
		"
		<?php
		$onclick = ob_get_clean();
		
		//
		// small img
		//
		?>
		<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
		onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
		onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
		<?php //echo $onclick; ?>
		>
		<?php
		
		switch($_targetpl)
		{
			case 'companies': $src = "img/$_targetsg/$_SESSION[lang]/color/64/$row[id].png"; break;
			case 'models': $src = "img/$_targetsg/$_SESSION[lang]/color/64/$row[id].png"; break;
			case 'users': $src = "img/$_targetpl/$_SESSION[lang]/color/64/$row[id].png"; break;
			case 'ordered_models': $src = "img/model/$_SESSION[lang]/ordered/color/64/$row[id].png"; break;
		}
		if(!is_file("$_SERVER[DOCUMENT_ROOT]/$src")) { $src = "img/ui/color/64/no.image.png"; }
		$mt = @filemtime("$_SERVER[DOCUMENT_ROOT]/$src");
		$imgs = @getimagesize("$_SERVER[DOCUMENT_ROOT]/$src");
		switch($_targetpl)
		{
			case 'companies':
			case 'models':
			case 'users':
			case 'ordered_models':
				echo '<img src="'."/$src?mt=$mt".'" '.$imgs[3].'
				class="acpRowPointer['.$_targetsg.']['.$row['id'].']" alt="'.$row['id'].'" border="0" />';
				break;
		}
		
		?>
		</td>
		<?php
		
		$ii=0; foreach($row as $k=>$v)
		{
			
			//
			// vars
			//
			$cc = ($ii%2==0) ? '#fff' : '#eee';
			$b = ($ii>0) ? ' border-left: 1px solid #666;' : '';
			
			//
			// default td
			//
			ob_start();
			?>
			<td class="cell_<?php echo $k; ?> pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
			style=" <?php echo $b; ?>"
			onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
			onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
			<?php //echo $onclick; ?>
			><?php echo $v; ?></td>
			<?php
			$_defaultTD = ob_get_clean();
			
			//
			// tds
			//
			switch($k)
			{
				
				//
				// company
				//
				case 'company':
					
					switch($_targetpl)
					{
						
						//
						// models|ordered_models/company
						//
						case 'models':
						case 'ordered_models':
							$q = "SELECT realname FROM info WHERE id=$v";
							$rr = mysql_query($q, $_mysql['db']['companies']);
							$vv = @mysql_result($rr, 0);
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							><a href="/?page=company&amp;company=<?php echo $v; ?>" target="_blank"><?php echo $vv; ?></a>
							<!--<div class="cell_<?php echo $k; ?>" style="display:none;"><?php echo $v; ?></div>-->
							</td>
							<?php
							break;
						
					}
					
					break;
				
				//
				// realname
				//
				case 'realname':
					
					switch($_targetpl)
					{
						
						//
						// compnanies/realname
						//
						case 'companies':
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							>
							<a href="/?page=company&amp;company=<?php echo $row['id']; ?>" target="_blank"><?php echo $v; ?></a>
							<!--<div class="cell_<?php echo $k; ?>" style="display:none;"><?php echo $v; ?></div>-->
							</td>
							<?php
							break;
						
						//
						// models/realname
						//
						case 'models':
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							>
							<a href="/?page=model&amp;model=<?php echo $row['id']; ?>&amp;edit=true" target="_blank"><?php echo $v; ?></a>
							<!--<div class="cell_<?php echo $k; ?>" style="display:none;"><?php echo $v; ?></div>-->
							</td>
							<?php
							break;
						
						//
						// default realname
						//
						default: echo $_defaultTD; break;
						
					}
					
					break;
				
				//
				// page
				//
				case 'page':
					
					switch($_targetpl)
					{
						
						//
						// users/page
						//
						case 'users':
							if($v && $v!='Administrator')
							{
								$vv = array();
								$q = "SELECT company FROM info WHERE id=$v";
								$rr = mysql_query($q, $_mysql['db']['models']);
								$cid = @mysql_result($rr, 0);
								$q = "SELECT realname FROM info WHERE id=$cid";
								$rr = mysql_query($q, $_mysql['db']['companies']);
								$vv[] = @mysql_result($rr, 0);
								$q = "SELECT realname FROM info WHERE id=$v";
								$rr = mysql_query($q, $_mysql['db']['models']);
								$vv[] = @mysql_result($rr, 0);
								$vv = join(' / ', $vv);
							}
							else { $vv = $v; }
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							><?php
							
							if($vv!='Administrator') { echo '<a href="/?page=model&amp;model='.$v.'&amp;edit=true" target="_blank">'; }
							echo $vv;
							if($vv!='Administrator') { echo '</a>'; }
							
							?>
							<!--<div class="cell_<?php echo $k; ?>" style="display:none;"><?php echo $v; ?></div>-->
							</td>
							<?php
							break;
						
					}
					
					break;
				
				//
				// user id
				//
				case 'uid':
					
					switch($_targetpl)
					{
						
						//
						// ordered_models/uid
						//
						case 'ordered_models':
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							><?php
							
							$q = "SELECT * FROM users WHERE id='$v'";
							$usqlr = mysql_query($q, $_mysql['db']['main']);
							$usqlrow = @mysql_fetch_assoc($usqlr);
							echo "$usqlrow[nickname] [$v]";
							
							?>
							</td>
							<?php
							break;
						
					}
					
					break;
				
				//
				// status
				//
				case 'status':
					
					switch($_targetpl)
					{
						
						//
						// ordered_models/status
						//
						case 'ordered_models':
							?>
							<td class="pointer acpRowPointer[<?php echo $_targetsg; ?>][<?php echo $row['id']; ?>]"
							style=" <?php echo $b; ?>"
							onmouseover="this.parentNode.style.backgroundColor='#ffffcc';"
							onmouseout="this.parentNode.style.backgroundColor='<?php echo $c; ?>';"
							<?php //echo $onclick; ?>
							><?php
							
							$class = 'acpRowPointer['.$_targetsg.']['.$row['id'].']';
							$a = array
							(
								'_msie' => array
								(
									'class' => $class,
									'alt' => $v,
									'border' => 0
								),
								'msie' => array
								(
									'class' => $class
								)
							);
							echo img_png("img/acp/$_targetsg/$k/$v.png", 0, $a);
							
							?></td>
							<?php
							break;
						
					}
					
					break;
				
				//
				// default td
				//
				default: echo $_defaultTD; break;
				
			}
			$ii++;
		}
		
		//
		// edit button
		//
		$title = $_buttonsxml['edit'][0].' '.$_buttonsxml[$_targetsg][0];
		ob_start();
		?>
		var $o =
		{
			'class'		: 'mainManager',
			'name'		: '<?php echo urlencode($title); ?>',
			'body'		: '<?php echo urlencode('window/AdministratorsControlPanel/main.manager.php'); ?>',
			'include'	: true,
			'callback'	: function($el)
			{
				MultiSelect.scan($el);
				createIframe('mainManager');
			},
			'bodyOpts'	:
			{
				'target' : '<?php echo $_targetsg; ?>',
				'type' : 'edit'
			}
		}
		var $post =
		{
			'id' : <?php echo $row['id']; ?>
		}
		Window.addInstance($o, $post);
		<?php
		$onclick = ob_get_clean();
		$class = 'pointer';
		$style = 'margin-left:2px;';
		$a = array
		(
			'_msie' => array
			(
				'class' => $class,
				'alt'=>$title,
				'title'=>$title,
				'border'=>'0',
				'onclick'=>$onclick,
				'style'=>$style
			),
			'msie' => array
			(
				'class' => $class,
				'title'=>$title,
				'onclick'=>$onclick,
				'style'=>$style
			)
		);
		echo '<td width="1" style="padding:0;">';
		echo img_png('img/ui/color/edit.png', $_msie, $a);
		echo '</td>';
		
		//
		// delete button
		//
		$title = $_buttonsxml['delete'][0].' '.$_buttonsxml[$_targetsg][0];
		ob_start();
		?>
		if(confirm('<?php printf($_buttonsxml['delete']['confirm'][$_targetsg][0], $row['id']); ?>'))
		{
			var $get =
			[
				'target=<?php echo $_targetsg; ?>',
				'id=<?php echo $row['id']; ?>'
			];
			XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/delete.php?'+$get.join('&amp;'),
			{'container':document.getElementById('pool'), 'xml':false, 'callback':
			function()
			{
				var $x = document.getElementById('main.client');
				var $core = Node.getElementByClassName('\\bcore\\b', $x);
				var $padd = Node.getElementByClassName('\\bpadding\\b', $core);
				var $get =
				[
					'target=<?php echo $_targetpl; ?>',
					'deleteError='+$_<?php echo $_targetsg; ?>DeleteError
				];
				XMLHttp.load('http://<?php echo $_SERVER['HTTP_HOST']; ?>/php/script/AdministratorsControlPanel/main.client.php?'+$get.join('&amp;'),
				{'container':$padd, 'xml':false});
			}
			});
		}
		<?php
		$onclick = ob_get_clean();
		$class = 'pointer';
		$style = 'margin: 0 2px;';
		$a = array
		(
			'_msie' => array
			(
				'class' => $class,
				'alt'=>$title,
				'title'=>$title,
				'border'=>'0',
				'onclick'=>$onclick,
				'style'=>$style
			),
			'msie' => array
			(
				'class' => $class,
				'title'=>$title,
				'onclick'=>$onclick,
				'style'=>$style
			)
		);
		echo '<td width="1" style="padding:0;">';
		echo img_png('img/ui/color/delete.png', $_msie, $a);
		echo '</td>';
		
		echo '</tr>';
		
		//
		// desc
		//
		echo '<tr style="background-color:'.$c.';">';
		echo '<td colspan="'.($_numFields+3).'" style="padding:0;">';
		?>
		<div id="acpExtended_<?php echo $_targetsg; ?>_<?php echo $row['id']; ?>" class="extended" style="display:none;"><div style="padding:10px;"></div></div>
		<?php
		echo '</td>';
		echo '</tr>';
		
	}
	
	echo '</table>';
	
	//
	// controls
	//
	$get = array
	(
		'get='.urlencode("page=AdministratorsControlPanel&amp;target=$_targetpl"),
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
	
} // if there are items

else
{
	?>
	<div class="empty">
	<?php echo $_modelxml['body']['empty_block']['pl'][0].' '.$_buttonsxml[$_targetpl][0]; ?>.
	</div>
	<?php
}

//
// end
//
include "$_SESSION[dr]/php/script/mysql/close.php";

?>