<?php

session_start();

//
// xml
//
$_topicxml = $XML->parse("$_SERVER[DOCUMENT_ROOT]/xml/lang/$_SESSION[lang]/help/$_topic.xml");
$_topicxml = $XML->toArray($_topicxml->tagChildren);

?>
<div style="margin: 10px 0;">
<?php echo $_topicxml['text']['start'][0]; ?>
</div>

<div style="margin: 10px 0;">
<?php echo $_topicxml['text']['log_in'][0]; ?>
<div align="center" style="margin: 10px 0;">
<img src="/img/help/<?php echo $_SESSION['lang']; ?>/page_editing/user.page.jpg" alt="<?php echo $_topicxml['img']['user_page'][0]; ?>" border="0" />
</div>
</div>

<div style="margin: 10px 0;">
<?php echo $_topicxml['text']['blank_page'][0]; ?>
<div align="center" style="margin: 10px 0;">
<img src="/img/help/<?php echo $_SESSION['lang']; ?>/page_editing/model-page.jpg" alt="<?php echo $_topicxml['img']['model_page'][0]; ?>" border="0" />
</div>
</div>