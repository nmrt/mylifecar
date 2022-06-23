

<?php

if($_SESSION['model']['edit'][$codeModelName])
{
	if(!$_edit)
	{
		
		//
		// page status
		//
		include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
		$q = "SELECT * FROM users WHERE page='$codeModelName'";
		$r = mysql_query($q, $_mysql['db']['main']);
		$sqlrow = @mysql_fetch_assoc($r);
		include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";
		
		?>
		<div align="center" class="AppearFade" style="display:none; background-color:#666;">
		<table border="0" cellspacing="0" cellpadding="<?php echo ($sqlrow['pagest']?10:2); ?>">
		<tr>
		<td>
		<?php
		$t = $Vars->page['body']['edit']['denied'][0];
		$tt = $Vars->page['body']['edit']['denied']['reason'][0];
		$a = array
		(
			'_msie' => array
			(
				'alt' => $t,
				'title' => $t
			),
			'msie' => array
			(
				'title' => $t
			)
		);
		echo img_png('img/ui/color/warning.png', $_msie, $a);
		?>
		</td>
		<td>
		<h6>
		<?php
		include 'php/script/user/text.php';
		echo $t;
		?>
		<?php if(!$sqlrow['pagest']) { ?>
		<a href="?page=user&amp;action=login.form&amp;continue=<?php echo urlencode($_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING']); ?>">
		<?php echo $_userText['login']['button'][0]; ?>
		</a>.
		<?php } ?>
		<br/>
		<?php if($x=$sqlrow['pagest']) { printf($tt, $x); } ?>
		</h6>
		</td>
		</tr>
		</table>
		</div>
		<?php
		$_SESSION['model']['edit'][$codeModelName] = false;
	}
}

?>

