/**
 * @package     Joomla.Administrator
 * @subpackage  Templates.isis
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       3.0
 */

(function($) {
  $(document).ready(function() {
    if (typeof profil_bootstrap_editor_gridmanager_options.tinymce !== 'undefined') {
      // add save handler to tinymce editor
      profil_bootstrap_editor_gridmanager_options.tinymce.setup = function(editor) {
        profilBootstrapEditorTinyMceSaveEvent(editor);
      }
      var gm = $(".editor-gridmanager").gridmanager( 
        profil_bootstrap_editor_gridmanager_options 
      ).data('gridmanager');
      $('.editor-gridmanager a.gm-addColumn, .editor-gridmanager a.add').on("click", function(e){ 
        profilBootstrapEditorTinyMceSave(e);
        console.log("added");
      });
      function profilBootstrapEditorTinyMceSaveEvent(editor) {
        editor.on('mouseleave', function(e) {
          if (editor.id != 'jform_articletext') {
            profilBootstrapEditorTinyMceSave(e);
            console.log("mouseleave");
          }
        });
        
        editor.on('change', function(e) {
          if (editor.id != 'jform_articletext') {
            profilBootstrapEditorTinyMceSave(e);
            console.log("changed");
          }
        });

        $('.editor-gridmanager a.gm-addColumn').on("click", function(e){ 
          profilBootstrapEditorTinyMceSave(e);
          console.log("added");
        });
      }

      function profilBootstrapEditorTinyMceSave(e) {
        var output = gm.deinitCanvas(true);
        $('#jform_articletext').val(output);
      }

    }
  })
})(jQuery);