<?php

session_start();

//
// xml
//
$_topicxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/help/$_topic.xml");
$_topicxml = $XML->toArray($_topicxml->tagChildren);

?>
<div align="center" style="margin: 10px 0;">
<img src="/img/1-1-1.<?php echo $_SESSION['lang']; ?>.jpg" alt="111" border="0" />
</div>
<div style="margin: 10px 0;">
<?php echo $_topicxml['text']['first'][0]; ?>
</div>

<div style="margin: 10px 0;"><?php echo $_topicxml['text']['window_not_logged_in'][0]; ?>
<div align="center">
<img src="/img/help/<?php echo $_SESSION['lang']; ?>/glance/window.not.logged.in.jpg" alt="<?php echo $_topicxml['img']['window_not_logged_in'][0]; ?>" border="0" />
</div>
</div>

<div style="margin: 10px 0;">
<?php echo $_topicxml['text']['basic_model_page'][0]; ?>
<div align="center">
<img src="/img/help/<?php echo $_SESSION['lang']; ?>/glance/first.model-page.logged.in.jpg" alt="<?php echo $_topicxml['img']['basic_model_page'][0]; ?>" border="0" />
</div>
</div>

<h6 align="center">
<?php echo $_topicxml['text']['the_end'][0]; ?>
</h6>