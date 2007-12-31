

<?php

session_start();

if(setcookie($_GET['k'], $_GET['v'], time()+(int)$_GET['t'], '/')) { echo 'success'; }
else { echo 'failure'; }

?>

