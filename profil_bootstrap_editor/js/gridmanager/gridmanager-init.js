(function($) {

  $(document).ready(function() {

    var tinyMceCloseTimer = false;

    var gm = $(".editor-gridmanager").gridmanager(

      profil_bootstrap_editor_gridmanager_options

    ).data('gridmanager');

    function profilBootstrapEditorSave(e) {
      gm.rteControl("stop");
      if (gm.options.baseGridStatus) {
        gm.removeBaseGrid();
      }
      var output = gm.deinitCanvas(true);
      $('#jform_articletext').val(output);
      if (gm.options.baseGridStatus) {
        gm.createBaseGrid();
      }
    }
/*
    // reset the timer to not close tinymce
    $('.editor-gridmanager').on('mouseenter', function() {
      if (tinyMceCloseTimer) {
        clearTimeout(tinyMceCloseTimer);
      }
    });

    // close tinymce when user is 3 sec inactive outside the editor
    $('.editor-gridmanager').on('mouseleave', function() {
      tinyMceCloseTimer = setTimeout(function() {
        gm.rteControl("stop");
      }, 3000);
    });
*/
    var elem = $('.editor-gridmanager')[0];
/*
    // close tinymce on a click outside the editor
    $(document).on('click', function(e) {
      if ($(e.target).closest(elem).length === 0) {
        if (tinyMceCloseTimer) {
          clearTimeout(tinyMceCloseTimer);
        }
        gm.rteControl("stop");
      }
    });
*/
    // close tinymce on escape key
    $(document).on('keydown', function(e) {
      if (e.keyCode === 27) {
        gm.rteControl("stop");
        if (tinyMceCloseTimer) {
          clearTimeout(tinyMceCloseTimer);
        }
      }
    });
    // check the joomla buttons if they contain the appropriate save function and add a class for saving process
    $('button:not(.button-processed)').addClass('button-processed').each(function() {
      if (
        $(this).attr("onclick") == "Joomla.submitbutton('article.save')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.apply')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.save2copy')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.save2new')"
      ) {
        $(this).addClass('gridmanager-save-button');
      }
    });

    $('.gridmanager-save-button').on("mouseenter", function(e) {
      profilBootstrapEditorSave(e);
    });

    $(window).resize(function(){
      gm.testBaseGrid();
    });

  });


})(jQuery);
