<?php

namespace MediaWiki\Extension\ColorizerToolVE;

use MediaWiki\Config\Config;
use MediaWiki\ResourceLoader\Hook\ResourceLoaderGetConfigVarsHook;

class Hooks implements ResourceLoaderGetConfigVarsHook {

	/**
	 * @inheritDoc
	 */
	public function onResourceLoaderGetConfigVars( array &$vars, $skin, Config $config ): void {
		$vars['wgColorizerToolVE'] = [
			'ColorPickerTextColors' => $config->get( 'ColorizerToolVEColorPickerTextColors' ),
			'ColorPickerBackgroundColors' => $config->get( 'ColorizerToolVEColorPickerBackgroundColors' ),
		];
	}

}
