/**
 * @package     Joomla.Administrator
 * @subpackage  Templates.isis
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @since       3.0
 */

(function($)
{
  $(document).ready(function()
  {
    //$('.editor').css('display', 'none');

    var tinyMceConfig = {
      mode : "exact",
      theme : "modern",
      skin : "lightgray",
      schema: "html5",
      inline_styles : true,
      gecko_spellcheck : true,
      relative_urls: true,
      selector : '.gm-editholder-active',
      setup : function(editor) {
        tinyMceMouseLeave(editor);
      }
    };
    
    var gm = $(".editor-gridmanager").gridmanager({ debug: 1, tinymce: {config:  tinyMceConfig }}).data('gridmanager');

    function tinyMceMouseLeave(editor) {
      editor.on('mouseleave', function(e) {
        if (editor.id != 'jform_articletext') {
          var output = gm.deinitCanvas(true);
          $('#jform_articletext').val(output);
        }
      });
    }
  })
})(jQuery);
