

pageScriptManager.main = {};
pageScriptManager.main.index = {};
pageScriptManager.main.index.user = {}

pageScriptManager.main.index.user.focusSelect = function()
{
	
	try
	{
		var $forms = document.getElementsByTagName('form');
		outerLoop:
		for(var $i=0; $i<$forms.length; $i++)
		{
			var $inputs = $forms[$i].getElementsByTagName('input');
			for(var $ii=0; $ii<$inputs.length; $ii++)
			{
				if(!$inputs[$ii].type.match(/^hidden$|^file$/))
				{
					if(!$inputs[$ii].value)
					{
						if(Node.isDisabled($inputs[$ii])==false)
						{
							if(!$inputs[$ii].disabled)
							{
								if($inputs[$ii].style.display!='none')
								{
									if($inputs[$ii].focus && $inputs[$ii].select)
									{
										$inputs[$ii].focus();
										//$inputs[$ii].select();
										break outerLoop;
									}
								}
							}
						}
					}
				}
			}
		}
	} // try
	catch($er) {  }
	
}

pageScriptManager.main.index.user.init = function()
{
	
	this.focusSelect();
	
	switch($_query['action'])
	{
		case 'edit':
		case 'edit.form': createIframe('edit'); break;
	}
	
}

