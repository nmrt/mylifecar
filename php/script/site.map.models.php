

<?php

session_start();

include "$_SESSION[dr]/php/script/mysql/connect.php";

$q = "SELECT * FROM info WHERE company='$_GET[company]'";
$r = mysql_query($q, $_mysql['db']['models']);
echo '<ul>';
while($row=@mysql_fetch_assoc($r))
{
	
	?>
	<li>
	<a href="javascript:void(null)" class="nobr"
	onmouseover="this.style.backgroundColor='#eee'"
	onmouseout="this.style.backgroundColor='#fff'"
	onclick=
	"
		var $get =
		[
			'page=model',
			/*'company=<?php echo $row['company']; ?>',*/
			'model=<?php echo $row['id']; ?>'
		];
		document.getElementById('<?php echo $_GET['input']; ?>').value = 'http://<?php echo $_SERVER['HTTP_HOST']; ?>/?'+$get.join('&');
	"
	><?php echo $row['realname']; ?></a>
	</li>
	<?php
	
}
echo '</ul>';

include "$_SESSION[dr]/php/script/mysql/close.php";

?>

