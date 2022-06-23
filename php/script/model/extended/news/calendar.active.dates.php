

<?php

session_start();

// mysql connect
include "$_SESSION[dr]/php/script/mysql/connect.php";

$q = "SELECT date FROM news ORDER BY date";
$r = mysql_query($q, $_mysql['db']['main']);

$_cal = array();
$_cal['syear'] = date('Y');
$_cal['eyear'] = date('Y');
$_cal['cmonth'] = date('n');

if($numr=@mysql_num_rows($r))
{
	
	$date = mysql_result($r, 0);
	list($y,$m,$d) = split('-', $date);
	$_cal['syear'] = $y;
	$date = mysql_result($r, $numr-1);
	list($y,$m,$d) = split('-', $date);
	$_cal['eyear'] = $y;
	$_cal['cmonth'] = $m;
	
}

?>

<script type="text/javascript" language="javascript">

$_<?php echo $_calid; ?>ActiveDates = [];
<?php

// mysql query and result
$q = "SELECT * FROM news WHERE model='$codeModelName' ORDER BY date";
$r = mysql_query($q, $_mysql['db']['main']);
while($row=@mysql_fetch_assoc($r))
{
	list($y,$m,$d) = split('-', $row['date']);
	echo '$_'.$_calid.'ActiveDates.push(['.$y.', \''.$m.'\', \''.$d.'\']);'."\n";
}

// mysql close
include "$_SESSION[dr]/php/script/mysql/close.php";

?>

</script>