<?php

$id = "{$dataBlockName}OperationReport";
if($_GET['saveError']=='true') { echo '<div id="'.$id.'" align="center" class="failure sansSerif">'.$Vars->page['body']['edit']['not_saved'][0]."</div>"; }
else if($_GET['saveError']=='false') { echo '<div id="'.$id.'" align="center" class="success">'.$Vars->page['body']['edit']['saved'][0]."</div>";  }
else if($_GET['deleteError']=='true') { echo '<div id="'.$id.'" align="center" class="failure sansSerif">'.$Vars->page['body']['edit']['not_deleted'][0]."</div>"; }
else if($_GET['deleteError']=='false') { echo '<div id="'.$id.'" align="center" class="success">'.$Vars->page['body']['edit']['deleted'][0]."</div>";  }
if(isset($_GET['saveError']) || isset($_GET['deleteError']))
{
	?>
	<script type="text/javascript">
	setTimeout(function(){ID('<?php echo $id; ?>').style.display='none'}, 10000);
	</script>
	<?php
}

?>