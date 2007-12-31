<?php

/*ini_set('display_errors', true);
error_reporting(E_ALL^E_NOTICE);*/

session_start();

include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/connect.php";
include_once "$_SERVER[DOCUMENT_ROOT]/php/class/XML.php"; $XML = new XML();
include "$_SERVER[DOCUMENT_ROOT]/php/script/user/text.php";

$_languagexml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/page/index.xml");
$_languagexml = $XML->toArray($_languagexml->tagChildren);
$_languagexml = $_languagexml['body'];

$q = "SELECT id, realname FROM info WHERE company=$_GET[company] ORDER BY realname";
$rr = mysql_query($q, $_mysql['db']['models']);
?>
<script type="text/javascript">
ID('<?php echo $_GET['sid']; ?>').innerHTML = '';
<?php
if(@mysql_num_rows($rr))
{
	while($row=@mysql_fetch_row($rr))
	{
		$s = ($row[0]==$_GET['model']) ? ' selected="selected"' : '';
		$q = "SELECT * FROM users WHERE page='$row[0]'";
		$sqlmpr = mysql_query($q, $_mysql['db']['main']);
		$sqluaa = @mysql_fetch_assoc($sqlmpr);
		if(@mysql_num_rows($sqlmpr) && $sqluaa['id']!=$_SESSION['user']['id'])
		{
			?>
			var $opt = Node.create('option',1)[0];
			$opt.value = '<?php echo $row[0]; ?>';
			$opt.className = 'disabled';
			$opt.disabled = 'disabled';
			$opt.innerHTML = '<?php echo $row[1]; ?>';
			Node.insert($opt, ID('<?php echo $_GET['sid']; ?>'));
			<?php
			/*echo '<option value="" class="disabled" disabled="disabled">';
			echo $row[1];
			echo '</option>';*/
		}
		else
		{
			?>
			var $opt = Node.create('option',1)[0];
			$opt.value = '<?php echo $row[0]; ?>';
			<?php if($s) { ?> $opt.selected = 'selected'; <?php } ?>
			$opt.innerHTML = '<?php echo $row[1]; ?>';
			Node.insert($opt, ID('<?php echo $_GET['sid']; ?>'));
			<?php
			//echo '<option value="'.$row[0].'"'.$s.'>'.$row[1].'</option>';
		}
	}
}
else
{
	$_userlxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/user.xml");
	$_userlxml = $XML->toArray($_userlxml->tagChildren);
	$q = "SELECT realname FROM info WHERE id=$_GET[company]";
	$rr = mysql_query($q, $_mysql['db']['companies']);
	$comn = @mysql_result($rr, 0);
	?>
	var $opt = Node.create('option',1)[0];
	$opt.value = '';
	$opt.className = 'disabled';
	$opt.disabled = 'disabled';
	$opt.innerHTML = '<?php printf($_userlxml['ui']['no_company_models'][0], $comn); ?>';
	Node.insert($opt, ID('<?php echo $_GET['sid']; ?>'));
	<?php
	/*echo '<option value="" class="disabled" disabled="disabled">';
	printf($_userlxml['ui']['no_company_models'][0], $comn);
	echo '</option>';*/
}
?>
MultiSelect.generate(ID('<?php echo $_GET['sid']; ?>'));
</script>
<?php

include "$_SERVER[DOCUMENT_ROOT]/php/script/mysql/close.php";

?>