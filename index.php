<?php

declare(strict_types=1);

include_once __DIR__.'/vendor/autoload.php';

use Tracy\Debugger;
Debugger::enable();

use Nette\Utils\Finder;


$latte = new Latte\Engine;
$latte->setTempDirectory(__DIR__.'/temp');

$templateParams = [];
$templateParams['basePath'] = './__index';

$list = [];

$dir = __DIR__.'/..';
$exclude = ['.DS_Store', '__index', 'index.php'];

$potencialSubDirs = ['www'];

foreach (Finder::find('*')->in($dir) as $path => $item) {
    $path = realpath($path);
    $filename = basename($path);
    $subDir = null;

    if (in_array($filename, $exclude)) continue;
    
    foreach ($potencialSubDirs as $potencialSubDir) {
        $exists = file_exists($path.'/'.$potencialSubDir);

        if ($exists) {
            $subDir = $potencialSubDir;
            break;
        }
    }

    $pathinfo = pathinfo($path);

    $item = [
        'path' => $path,
        'target' => $filename,
        'subtarget' => $subDir,
        'type' => is_dir($path) ? 'dir' : 'file',
        'extension' => isset($pathinfo['extension']) ? $pathinfo['extension'] : null,
    ];

    $list[] = $item;
}

$templateParams['list'] = $list;

// Render
$latte->render(__DIR__.'/templates/list.latte', $templateParams);