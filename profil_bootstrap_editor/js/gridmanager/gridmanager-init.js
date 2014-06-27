/**
 * @package     Joomla.Administrator
 * @subpackage  Templates.isis
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       3.0
 */

(function($) {
  $(document).ready(function() {
    var gm = $(".editor-gridmanager").gridmanager(
      profil_bootstrap_editor_gridmanager_options
    ).data('gridmanager');

    function profilBootstrapEditorSave(e) {
      var output = gm.deinitCanvas(true);
      $('#jform_articletext').val(output);
    }

    $('#toolbar-apply, #toolbar-save, #toolbar-save-new').on("mouseenter", function (e) {
      profilBootstrapEditorSave(e);
    });
  });
})(jQuery);
