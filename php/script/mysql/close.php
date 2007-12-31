<?php

foreach($_mysql['db'] as $db) { @mysql_close($db); }

?>