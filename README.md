Bootstrap-editor
================

Gridmanager bootstrap editor integration into Joomla. The editor is based on the work and efforts of Tom King (https://github.com/neokoenig/) and pbreah (https://github.com/pbreah/).
This editor is a Joomla plugin compatible with Joomla 3.0 upwards.

If you like to test it download the latest version from here:

https://github.com/DHoffm/Bootstrap-editor/raw/master/pkg_profil_bootstrap_editor.zip

If you do not use a Bootstrap 3 Template on the Frontend, make sure to enable the content plugin after install. This includes the bootstrap css and js on the frontend.


##The editor supports

- Bootstrap 3 Grid (md-col-* classes) (Bootstrap 2 Grid needs some extra effort because of layout issues)
- Bootstrap Offsets (md-col-offset-* classes)
- TinyMCE integration (if TinyMCE is not enabled a default textarea fallback is used)
- the editor integrates Joomla editor-xtd buttons (image, article etc.)
- the editor integrates Bootstrap 3 button classes in tinymce
- the editor integrates Widgetkit shortcodes for available slideshows, galleries, accordions, maps or slidesets
- ID's and classes for each row and columns
- Sortable rows and columns
- Joomla 3, (Joomla 2.5 needs some extra efforts on TinyMCE integration)


##Demo
You can test the latest gridmanager editor here: http://neokoenig.github.io/jQuery-gridmanager/

A joomla 3 demo page is available here: http://editor.profilpr.de

##Tested Templates/Frameworks

This plugin was tested with the following template frameworks:
- Joomla Protostar
- T3 Framework
- Gantry
- Construct

##ToDo

- add support for Joomla CodeMirror and CKEditor
- add all Boostrap grid sizes (col-xs-*, col-sm-*, col-lg-*)
- support Joomla 2.5
- fully support Bootstrap 2 (generates the Bootstrap tags but displayed incorrectly)
- ~~tranlate Gridmanager~~
- add translation for install package
- ~~support Bootstrap button styles on the editors~~
- ~~support Bootstrap background styles on the editors~~
- support Bootstrap image styles on the editors
- ~~support joomla editors-xtd buttons~~
