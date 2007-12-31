

<?php

session_start();

//
// browser
//
$height = 200;

?>

<div class="browser imageBrowser" style="width:300px; height:<?php echo $height; ?>px; overflow-x:scroll;">
<?php

foreach($_GET['o'] as $k=>$v) { $_SESSION['browser'][$k] = urldecode($v); }
$_SESSION['browser']['height'] = $height;
include 'browser.core.php';

?>
</div>

