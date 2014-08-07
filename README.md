Bootstrap-editor
================

Gridmanager bootstrap editor integration into Joomla. The editor is based on the work and efforts of Tom King (https://github.com/neokoenig/) and pbreah (https://github.com/pbreah/).
This editor a Joomla plugin compatible with Joomla 3.0 upwards.

If you like to test it download the latest version from here:

https://github.com/DHoffm/Bootstrap-editor/raw/master/pkg_profil_bootstrap_editor.zip

Make sure to enable the content plugin after install. This includes the bootstrap css and js on the frontend.


##The editor supports

- Bootstrap 3 Grid (md-col-* classes) (Bootstrap 2 Grid needs some extra effort because of layout issues)
- Bootstrap Offsets (md-col-offset-* classes)
- TinyMCE integration (if TinyMCE is not enabled a default textarea fallback is used)
- ID's and classes for each row and columns
- Sortable rows and columns
- Joomla 3, (Joomla 2.5 needs some extra efforts on TinyMCE integration)


##Demo
You can test the latest editor here: http://neokoenig.github.io/jQuery-gridmanager/

A joomla 3 demo page is available here: http://editor.profilpr.de


##ToDo

- add support for Joomla CodeMirror and CKEditor
- add all Boostrap grid sizes (xs-col-*, sm-col-*, lg-col-*)
- support Joomla 2.5
- fully support Bootstrap 2 (generates the Bootstrap tags but displayed incorrectly)
- support Bootstrap styles on the editors
