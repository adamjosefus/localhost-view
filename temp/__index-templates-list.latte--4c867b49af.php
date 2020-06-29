<?php
// source: /Applications/XAMPP/xamppfiles/htdocs/__index/templates/list.latte

use Latte\Runtime as LR;

final class Template4c867b49af extends Latte\Runtime\Template
{

	public function main(): array
	{
		extract($this->params);
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Localhost</title>

    <link rel="stylesheet" href="<?php echo LR\Filters::escapeHtmlAttr(LR\Filters::safeUrl($basePath)) /* line 9 */ ?>/style.css">
</head>
<body>

<main>
    <div class="header">
        <div class="header-content">
            <input type="text" id="filterInput" placeholder="Filter" autofocus>
        </div>
    </div>

    <div class="list" id="listContainer">
    </div>

    <script src="<?php echo LR\Filters::escapeHtmlAttr(LR\Filters::safeUrl($basePath)) /* line 23 */ ?>/main.js"></script>
    <script>
        window.listData = <?php echo LR\Filters::escapeJs($list) /* line 25 */ ?>;
    </script>
</main>
    
</body>
</html><?php
		return get_defined_vars();
	}

}
