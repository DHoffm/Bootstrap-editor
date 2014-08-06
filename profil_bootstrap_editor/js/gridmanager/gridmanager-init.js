(function($) {

  $(document).ready(function() {
    // add a close button to the tinymce on init event
    profil_bootstrap_editor_gridmanager_options.tinymce.config.setup = function(ed) {
      ed.on('init', function (ed) {
        console.log("init");
        var closeButton = $("<div/>").addClass("gm-toggleTinyMce mce-widget pull-right mce-btn mce-menubtn mce-flow-layout-item").append($("<button/>").append($("<span/>").addClass('icon-cancel').append(" ")));
        $('.mce-menubar .mce-container-body').append(closeButton);
      });
    }

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

    // close tinymce on escape key
    $(document).on('keydown', function(e) {
      if (e.keyCode === 27) {
        gm.rteControl("stop");
      }
    });

    // tinymce close button event
    $('.editor-gridmanager').on("click", '.gm-toggleTinyMce button', function(e) {
      gm.rteControl("stop");
      e.preventDefault();
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
