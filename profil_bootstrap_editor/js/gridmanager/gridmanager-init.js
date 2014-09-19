(function($) {

  $(document).ready(function() {
    if (typeof profil_bootstrap_editor_gridmanager_options.tinymce !== "undefined") {
      var translation = profil_bootstrap_editor_gridmanager_options.translation;

      function handleTinymceBootstrapButton(button, ed, classes) {
        ed.focus();
        button.active(!button.active());
        var state = button.active();
        if (state) {
          ed.selection.setContent('<a href="#" class="btn ' + classes + '">' + ed.selection.getContent() + '</a>');
        } else {
          var content = $(ed.selection.getNode()).html();
          if ($(ed.selection.getNode()).hasClass("btn")) {
            ed.dom.remove(ed.dom.getParent(ed.selection.getNode(), 'a'));
            ed.selection.setContent(content);
          }
        }
      }

      function handleTinymceBootstrapButtonState(button, ed, btnStyle, btnSize) {
        // called when the menu is visible
        // if the user already clicked inside the editor this check sets the button state initially
        button.active($(ed.selection.getNode()).hasClass(btnStyle) && $(ed.selection.getNode()).hasClass(btnSize));
        // check the state again when the user clicks inside the edit area
        ed.on('click', function(e) {
          button.active($(ed.selection.getNode()).hasClass(btnStyle) && $(ed.selection.getNode()).hasClass(btnSize));
        });
      }

      function handleTinymceBootstrapContextualBackgrounds(button, ed, cbClass) {
        ed.focus();
        button.active(!button.active());
        var state = button.active();
        if (state) {
          ed.selection.setContent('<p class="' + cbClass + '">' + ed.selection.getContent() + '</p>');
        } else {
          var content = $(ed.selection.getNode()).html();
          if ($(ed.selection.getNode()).hasClass(cbClass)) {
            ed.dom.remove(ed.dom.getParent(ed.selection.getNode(), 'p'));
            ed.selection.setContent(content);
          }
        }
      }

      function handleTinymceBootstrapContextualBackgroundsState(button, ed, cbClass) {
        // called when the menu is visible
        // if the user already clicked inside the editor this check sets the button state initially
        button.active($(ed.selection.getNode()).hasClass(cbClass));
        // check the state again when the user clicks inside the edit area
        ed.on('click', function(e) {
          button.active($(ed.selection.getNode()).hasClass(cbClass));
        });
      }

      function handleTinymceWidgetkitButton(ed, id) {
        ed.focus();
        ed.selection.setContent('[widgetkit id=' + id + ']');
      }
      // add a close button and bootstrap buttons to the tinymce on init event
      profil_bootstrap_editor_gridmanager_options.tinymce.config.setup = function(ed) {
        ed.on('init', function(ed) {
          var closeButton = $("<div/>").addClass("gm-toggleTinyMce mce-widget pull-right mce-btn mce-menubtn mce-flow-layout-item").append($("<button/>").append($("<span/>").addClass('icon-cancel').append(" ")));
          $('.mce-menubar .mce-container-body').append(closeButton);
          // replace tinymce buttons with joomla image link and article link
          $('.mce-gridmanager-joomla-buttons button').remove();
          $('.mce-gridmanager-joomla-buttons').append($('#editor-xtd-buttons a.gridmanager-joomla-btn'));
        });

        ed.on('remove', function(ed) {
          // remove the joomla image link from tinymce and copy it back to origin
          $('#editor-xtd-buttons').append($('.mce-gridmanager-joomla-buttons a.gridmanager-joomla-btn'));
        });

        var bootstrapMenu = [];

        if (profil_bootstrap_editor_gridmanager_options.bootstrapStyles.buttons.settings.enabled == true) {
          var buttonTypes = profil_bootstrap_editor_gridmanager_options.bootstrapStyles.buttons.types;
          var bootstrapButtons = {
            text: translation.bootstrapButtons,
            menu: [
            {
              text: translation.bootstrapButtonsLarge,
              menu: [
                { text: translation.bootstrapButtonsStyleDefault, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-default " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-default", buttonTypes.large); } },
                { text: translation.bootstrapButtonsStylePrimary, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-primary " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-primary", buttonTypes.large); } },
                { text: translation.bootstrapButtonsStyleSuccess, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-success " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-success", buttonTypes.large); } },
                { text: translation.bootstrapButtonsStyleInfo, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-info " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-info", buttonTypes.large); } },
                { text: translation.bootstrapButtonsStyleWarning, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-warning " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-warning", buttonTypes.large); } },
                { text: translation.bootstrapButtonsStyleDanger, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-danger " + buttonTypes.large); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-danger", buttonTypes.large); } }
              ]
            }, {
              text: translation.bootstrapButtonsDefault,
              menu: [
                { text: translation.bootstrapButtonsStyleDefault, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-default " + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-default", buttonTypes.default); } },
                { text: translation.bootstrapButtonsStylePrimary, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-primary " + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-primary", buttonTypes.default); } },
                { text: translation.bootstrapButtonsStyleSuccess, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-success " + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-success", buttonTypes.default); } },
                { text: translation.bootstrapButtonsStyleInfo, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-info " + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-info", buttonTypes.default); } },
                { text: translation.bootstrapButtonsStyleWarning, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-warning " + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-warning", buttonTypes.default); } },
                { text: translation.bootstrapButtonsStyleDanger, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-danger" + buttonTypes.default); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-danger", buttonTypes.default); } }
              ]
            }, {
              text: translation.bootstrapButtonsSmall,
              menu: [
                { text: translation.bootstrapButtonsStyleDefault, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-default " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-default", buttonTypes.small); } },
                { text: translation.bootstrapButtonsStylePrimary, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-primary " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-primary", buttonTypes.small); } },
                { text: translation.bootstrapButtonsStyleSuccess, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-success " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-success", buttonTypes.small); } },
                { text: translation.bootstrapButtonsStyleInfo, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-info " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-info", buttonTypes.small); } },
                { text: translation.bootstrapButtonsStyleWarning, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-warning " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-warning", buttonTypes.small); } },
                { text: translation.bootstrapButtonsStyleDanger, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-danger " + buttonTypes.small); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-danger", buttonTypes.small); } }
              ]

            }, {
              text: translation.bootstrapButtonsExtraSmall,
              menu: [
                { text: translation.bootstrapButtonsStyleDefault, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-default " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-default", buttonTypes.extraSmall); } },
                { text: translation.bootstrapButtonsStylePrimary, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-primary " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-primary", buttonTypes.extraSmall); } },
                { text: translation.bootstrapButtonsStyleSuccess, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-success " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-success", buttonTypes.extraSmall); } },
                { text: translation.bootstrapButtonsStyleInfo, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-info " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-info", buttonTypes.extraSmall); } },
                { text: translation.bootstrapButtonsStyleWarning, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-warning " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-warning", buttonTypes.extraSmall); } },
                { text: translation.bootstrapButtonsStyleDanger, onclick: function() { handleTinymceBootstrapButton(this, ed, "btn-danger " + buttonTypes.extraSmall); }, onPostRender: function() { handleTinymceBootstrapButtonState(this, ed, "btn-danger", buttonTypes.extraSmall); } }
              ]
            }]
          };
          bootstrapMenu.push(bootstrapButtons);
        }

        if (profil_bootstrap_editor_gridmanager_options.bootstrapStyles.contextual_backgrounds.settings.enabled == true) {
          var bootstrapBackgrounds = {
            text: translation.bootstrapContextBackground,
            menu: [
              { text: translation.bootstrapButtonsStylePrimary, onclick: function() { handleTinymceBootstrapContextualBackgrounds(this, ed, 'bg-primary'); }, onPostRender: function() { handleTinymceBootstrapContextualBackgroundsState(this, ed, 'bg-primary'); } },
              { text: translation.bootstrapButtonsStyleSuccess, onclick: function() { handleTinymceBootstrapContextualBackgrounds(this, ed, 'bg-success'); }, onPostRender: function() { handleTinymceBootstrapContextualBackgroundsState(this, ed, 'bg-success'); } },
              { text: translation.bootstrapButtonsStyleInfo, onclick: function() { handleTinymceBootstrapContextualBackgrounds(this, ed, 'bg-info'); }, onPostRender: function() { handleTinymceBootstrapContextualBackgroundsState(this, ed, 'bg-info'); } },
              { text: translation.bootstrapButtonsStyleWarning, onclick: function() { handleTinymceBootstrapContextualBackgrounds(this, ed, 'bg-warning'); }, onPostRender: function() { handleTinymceBootstrapContextualBackgroundsState(this, ed, 'bg-warning'); } },
              { text: translation.bootstrapButtonsStyleDanger, onclick: function() { handleTinymceBootstrapContextualBackgrounds(this, ed, 'bg-danger'); }, onPostRender: function() { handleTinymceBootstrapContextualBackgroundsState(this, ed, 'bg-danger'); } }
            ]
          };
          bootstrapMenu.push(bootstrapBackgrounds);
        }
        var bootstrapStyles = 0; // Object.keys(bootstrapMenu).length is not supported in IE < 9 therefore use a loop
        for (i in bootstrapMenu) {
          if (bootstrapMenu.hasOwnProperty(i)) {
            bootstrapStyles++;
          }
        }
        if (bootstrapStyles > 0) {
          ed.addButton('bootstrap', {
            type: 'menubutton',
            text: 'Bootstrap',
            classes: 'widget btn btn-small first last gridmanager_bootstrap',
            icon: false,
            autofocus: true,
            menu: bootstrapMenu
          });
        }
        ed.addButton('joomlabuttons', {
          text: 'JoomlaButtons',
          onclick: function() {
            return false;
          },
          classes: 'btn gridmanager-joomla-buttons btn-small'
        });

        if (profil_bootstrap_editor_gridmanager_options.widgetkit != false) {
          var widgetkit_widgets = [];
          $.each(profil_bootstrap_editor_gridmanager_options.widgetkit, function(type_index, type_value) {
            types = {};
            types['text'] = type_index;
            types['menu'] = [];
            $.each(type_value, function(index, value) {
              obj = {};
              obj['text'] = value;
              obj['onclick'] = function() {
                handleTinymceWidgetkitButton(ed, index);
              }
              types['menu'].push(obj);
            });
            widgetkit_widgets.push(types);
          });
          ed.addButton('widgetkit', {
            type: 'menubutton',
            text: 'Widgetkit',
            classes: 'widget btn btn-small first last gridmanager_widgetkit',
            icon: false,
            menu: widgetkit_widgets
          });
        }
      }

      profil_bootstrap_editor_gridmanager_options.tinymce.config.toolbar2 += " | bootstrap";
      if (profil_bootstrap_editor_gridmanager_options.widgetkit != false) {
        profil_bootstrap_editor_gridmanager_options.tinymce.config.toolbar2 += " | widgetkit";
      }

      profil_bootstrap_editor_gridmanager_options.tinymce.config.toolbar2 += " | joomlabuttons";
    }
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
      var re = new RegExp(profil_bootstrap_editor_gridmanager_options.root, "g");
      if ($('.editor-gridmanager-textarea').val()) {
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
        $(this).attr("onclick") == "Joomla.submitbutton('module.save2copy')" ||
        $(this).attr("onclick") == "Joomla.submitbutton('module.save2new')"
      ) {
        $(this).addClass('gridmanager-save-button');
      }
    });

    $('.gridmanager-save-button').on("mouseenter", function(e) {
      profilBootstrapEditorSave(e);
    });

    $(window).resize(function() {
      gm.testBaseGrid();
    });
  });
})(jQuery);
