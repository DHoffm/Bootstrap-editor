(function($) {

  $(document).ready(function() {
    //textareaRelativeToAbsoluteURLs();
    function handleTinymceBootstrapButton(button, ed, classes) {
      ed.focus();
      button.active( !button.active() );
      var state = button.active();
      if (state) {
        ed.selection.setContent('<a href="#" class="btn ' + classes + '">' + ed.selection.getContent() + '</a>');
      } else {
        var content = ed.selection.getContent();
        if ( $( ed.selection.getNode() ).hasClass( "btn" ) ) {
          ed.dom.remove(ed.dom.getParent(ed.selection.getNode(), 'a'));
          ed.selection.setContent(content);
        }
      }
    }
    // add a close button and bootstrap buttons to the tinymce on init event
    profil_bootstrap_editor_gridmanager_options.tinymce.config.setup = function(ed) {
      ed.on('init', function (ed) {
        var closeButton = $("<div/>").addClass("gm-toggleTinyMce mce-widget pull-right mce-btn mce-menubtn mce-flow-layout-item").append($("<button/>").append($("<span/>").addClass('icon-cancel').append(" ")));
        $('.mce-menubar .mce-container-body').append(closeButton);
      });
      ed.addButton('bootstrap', {
        type: 'menubutton',
        text: 'Bootstrap',
        icon: false,
        menu: [
          {
            text: 'Buttons',
            menu: [
              {
                text: 'Default',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-default"); }
              },
              {
                text: 'Primary',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-primary"); }
              },
              {
                text: 'Success',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-success"); }
              },
              {
                text: 'Info',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-info"); }
              },
              {
                text: 'Warning',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-warning"); }
              },
              {
                text: 'Danger',
                onclick: function(){ handleTinymceBootstrapButton(this, ed, "btn-danger"); }
              },
            ]
          }
          /*{text: 'Menu item 2', onclick: function() {ed.insertContent('Menu item 2');}}*/
        ]
      });
    }
    profil_bootstrap_editor_gridmanager_options.tinymce.config.toolbar2 += " | bootstrap";

    var gm = $(".editor-gridmanager").gridmanager(
      profil_bootstrap_editor_gridmanager_options
    ).data('gridmanager');
    gm.gridmanagerRelativeToAbsoluteURLs();

    /*function textareaRelativeToAbsoluteURLs() {
      $('#jform_articletext').each(function() {
        var html = $('<div></div>');
        html.append($(this).val());
        img = html.find('img');
        img.attr('src', function(idx, src) {
          if ($(this).attr('src').indexOf(profil_bootstrap_editor_gridmanager_options.root) == -1) {
            return profil_bootstrap_editor_gridmanager_options.root + $(this).attr('src');
          }
        });

        $(this).val(html.html());
      });
    }*/

    function textareaAbsoluteToRelativeURLs() {
      var re = new RegExp(profil_bootstrap_editor_gridmanager_options.root,"g");
      if($('.editor-gridmanager-textarea').val()) {
        $('.editor-gridmanager-textarea').val($('.editor-gridmanager-textarea').val().replace(re, ''));
      }
    }

    function profilBootstrapEditorSave(e) {
      gm.rteControl("stop");
      if (gm.options.baseGridStatus) {
        gm.removeBaseGrid();
      }

      var output = gm.deinitCanvas(true);
      $('.editor-gridmanager-textarea').val(output);
      // remove the absolute urls to use relative urls on the frontend
      gm.gridmanagerRelativeToAbsoluteURLs();
      textareaAbsoluteToRelativeURLs();
      if (gm.options.baseGridStatus) {
        gm.createBaseGrid();
      }
    }

    // close tinymce on escape key
    $(document).on('keydown', function(e) {
      if (e.keyCode === 27) {
        gm.rteControl("stop");
        gm.gridmanagerRelativeToAbsoluteURLs();
      }
    });

    // tinymce close button event
    $('.editor-gridmanager').on("click", '.gm-toggleTinyMce button', function(e) {
      gm.rteControl("stop");
      gm.gridmanagerRelativeToAbsoluteURLs();
      e.preventDefault();
    });

    // check the joomla buttons if they contain the appropriate save function and add a class for saving process
    $('button:not(.button-processed)').addClass('button-processed').each(function() {
      if (
        $(this).attr("onclick") == "Joomla.submitbutton('article.save')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.apply')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.save2copy')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('article.save2new')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('module.save')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('module.apply')" ||
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
