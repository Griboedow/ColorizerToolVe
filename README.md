ColorizerToolVе is a VisualEditor extension for MediaWiki that adds a beautiful [Coloris](https://coloris.js.org/) color picker to style text, text backgrounds, and table cells with custom colors.

MediaWiki page: https://www.mediawiki.org/wiki/Extension:ColorizerToolVe

# Prerequisites
Tested on MediaWiki 1.43. Not sure about older versions.

# Installation
Installation is pretty standard:
1. Download extension to the extensions folder.
2. Load the extension in LocalSettings.php ```wfLoadExtension( 'ColorizerToolVe' );```

 # Configuration
 You can customize pre-defined colors in a color picker via these configuration parameters:
 ```php
$wgColorizerToolVEColorPickerTextColors = [
    "#68349A",
    "#B02418",
    "#EA3323",
    "#F5C342",
    "#FFFF54",
    "#081F5C",
    "#2F6EBA",
    "#4EADEA",
    "#4EAD5B",
    "#9FCE63",
    "#000000",
    "#595959",
    "#BFBFBF",
    "#E7E6E6",
    "#FFFFFF"
];
```
 ```php
$wgColorizerToolVEColorPickerBackgroundColors = [
    "#DF4532",
    "#F0918E",
    "#67ABE5",
    "#A3C1E3",
    "#CDDFF6",
    "#FFFF73",
    "#FFFFCA",
    "#67AB64",
    "#A9CD71",
    "#CBDFB8",
    "#8A5EC2",
    "#B99FDA",
    "#000000",
    "#ADAAAA",
    "#FFFFFF"
];
```

Place these definitions in ```LocalSettings.php``` before loading the extension to override the default palettes.

# Usage
In visual edit mode go to text styles > more and you will see 2 options -- colorize text and colorize background. The last one can change both text and table cell colors. 

See example in the gif below:
![ColorizerToolVE](https://github.com/user-attachments/assets/8fcf8a80-66d0-4cd3-9164-8a15f6b86ec0)








