<?php

namespace MediaWiki\Extension\ColorizerToolVE;

use MediaWiki\ResourceLoader\Hook\ResourceLoaderGetConfigVarsHook;
use MediaWiki\Config\Config;

class Hooks implements ResourceLoaderGetConfigVarsHook
{
   public function onResourceLoaderGetConfigVars(array &$vars, $skin, Config $config): void
   {
      $vars['wgColorizerToolVE'] = [
         'ColorPickerTextColors' => $config->get('ColorizerToolVEColorPickerTextColors'),
         'ColorPickerBackgroundColors' => $config->get('ColorizerToolVEColorPickerBackgroundColors'),
      ];
   }
}
