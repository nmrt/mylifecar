

<?php

//
// variables
//
include 'text.php';
$alerts = $text['logout']['alerts'];

//
// engine
//
$user = $_SESSION['user'];
$u = ($user['first_name'] && $user['last_name'])
? $user['first_name'].' '.$user['last_name']
: $user['nickname'];
if($user['page']) { unset($_SESSION['model']['edit']); }
unset($_SESSION['user']);
$r = '<h2 class="success">'.$alerts['ok'][0].': '.$u.'</h2>';
$rtip = '<div class="tip">'.$alerts['ok']['tip'][0].'</div>';
$_SESSION['report'] = $r.$rtip;

?>

<script type="text/javascript">
location.href='/?page=user&action=login.form';
</script>

