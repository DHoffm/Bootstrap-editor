/**
 * @package     Joomla.Administrator
 * @subpackage  Templates.isis
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       3.0
 */

(function($) {
  $(document).ready(function() {
    if (typeof profil_bootstrap_editor_tinymce_options !== 'undefined') {
      // add save handler to tinymce editor
      profil_bootstrap_editor_tinymce_options.setup = function(editor) {
        profilBootstrapEditorTinyMceSave(editor);
      }
      var gm = $(".editor-gridmanager").gridmanager({ debug: 1, tinymce: {config:  profil_bootstrap_editor_tinymce_options }}).data('gridmanager');
      function profilBootstrapEditorTinyMceSave(editor) {
        editor.on('mouseleave', function(e) {
          if (editor.id != 'jform_articletext') {
            var output = gm.deinitCanvas(true);
            $('#jform_articletext').val(output);
          }
        });
      }
    }
  })
})(jQuery);
