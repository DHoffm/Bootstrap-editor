/*
 * GridManager
 *
 *
 * Copyright (c) 2014 Tom King
 * Licensed under the MIT license.
 */


(function($) {

  $.gridmanager = function(el, options) {
    var gm = this;
    gm.$el = $(el);
    gm.el = el;
    gm.$el.data("gridmanager", gm);

    /*------------------------------------------ API ----------------------------------------*/
    gm.appendHTMLSelectedCols = function(html) {
      var canvas = gm.$el.find("#" + gm.options.canvasId);
      var cols = canvas.find(gm.options.colSelector);
      $.each(cols, function(index) {
        if ($(this).hasClass(gm.options.gmEditClassSelected)) {
          $('.gm-editholder', this).append(html);
        }
      });
    }
    /*------------------------------------------ INIT ---------------------------------------*/
    gm.init = function() {
      gm.options = $.extend({}, $.gridmanager.defaultOptions, options);
      gm.log("INIT");
      gm.rteControl("init");
      gm.createCanvas();
      // add background grid
      gm.createControls();
      gm.initControls();
      gm.initCanvas();
      gm.log("FINISHED");
    };

    /*------------------------------------------ Canvas & Controls ---------------------------------------*/

    /* Build and append the canvas, making sure existing HTML in the user's div is wrapped */
    gm.createCanvas = function() {
      gm.log("+ Create Canvas");
      var html = gm.$el.html();
      gm.$el.html("");
      $('<div/>', {'id': gm.options.canvasId, 'html': '<div class="row-holder">' + html + '</div>'}).appendTo(gm.$el);
    };

    /* Build and prepend the control panel */
    gm.createControls = function() {
      gm.log("+ Create Controls");
      var buttons = [];
      // Dynamically generated row template buttons
      $.each(gm.options.controlButtons, function(i, val) {
        var label = val[0];
        var _class = gm.generateButtonClass(val[1]);
        buttons.push("<a title='" + gm.options.addRow + " " + _class + "' class='" + gm.options.controlButtonClass + " add" + _class + "'><span class='" + gm.options.controlButtonSpanClass + "'></span> " + label + " " + _class + "</a>");
        gm.generateClickHandler(val[1]);
      });
      buttons.push("<a title='" + gm.options.readmoreTitleInfo + "' class='" + gm.options.controlButtonClass + " readmore'><span class='" + gm.options.controlButtonSpanClass + "'></span>&nbsp;" + gm.options.readmoreTitle + "</a>");
      gm.generateReadmoreClickHandler();

      /* Generate the control bar markup */
      gm.$el.prepend(
        $('<div/>', {
          'id': gm.options.controlId,
          'class': gm.options.gmClearClass
        }).prepend(
          $('<div/>', {
            "class": gm.options.rowClass
          }).html(
            $('<div/>', {
              "class": gm.options.colClass + 12
            }).addClass(gm.options.colAdditionalClass).html(
              $('<div/>', {
                'id': 'gm-addnew'
              })
              .addClass(gm.options.gmBtnGroup)
              .addClass(gm.options.gmFloatLeft).html(
                buttons.join("")
              )
            ).append(gm.options.controlAppend)
          )
        )
      );
    };

    /* Add click functionality to the buttons */
    gm.initControls = function() {
      var canvas = gm.$el.find("#" + gm.options.canvasId + ' .row-holder');
      gm.log("+ InitControls Running");

      // Turn editing on or off
      gm.$el.on("click", ".gm-preview", function() {
        // Destroy any RTEs
        gm.rteControl("stop");
        gm.gridmanagerRelativeToAbsoluteURLs();
        if (gm.status) {
          if (gm.options.baseGridStatus) {
            gm.removeBaseGrid();
          }
          gm.deinitCanvas();
          $(this).parent().find(".gm-mode").prop('disabled', true);
          $(this).parent().find(".gm-basegrid").prop('disabled', true);
        } else {
          gm.initCanvas();
          if (gm.options.baseGridStatus) {
            gm.createBaseGrid();
          }
          $(this).parent().find(".gm-mode").prop('disabled', false);
          $(this).parent().find(".gm-basegrid").prop('disabled', false);
        }
        $(this).toggleClass(gm.options.gmDangerClass);

        // Switch editing mode
      }).on("click", ".gm-mode", function() {
        gm.rteControl("stop");
        if (gm.mode === "visual") {
          if (gm.options.baseGridStatus) {
            gm.removeBaseGrid();
          }
          gm.deinitCanvas();
          canvas.html($('<textarea/>').attr("cols", 130).attr("rows", 25).val(canvas.html()));
          gm.gridmanagerAbsoluteToRelativeURLs();
          gm.mode = "html";
          $(this).parent().find(".gm-preview").prop('disabled', true);
          $(this).parent().find(".gm-basegrid").prop('disabled', true);
        } else {
          var editedSource = canvas.find("textarea").val();
          canvas.html(editedSource);
          gm.initCanvas();
          if (gm.options.baseGridStatus) {
            gm.createBaseGrid();
          }
          gm.mode = "visual";
          $(this).parent().find(".gm-preview").prop('disabled', false);
          $(this).parent().find(".gm-basegrid").prop('disabled', false);
          gm.gridmanagerRelativeToAbsoluteURLs();
        }
        $(this).toggleClass(gm.options.gmDangerClass);

      // enable or disable the base grid
      }).on("click", ".gm-basegrid", function() {
        if (gm.options.baseGridStatus) {
          gm.options.baseGridStatus = false;
          gm.removeBaseGrid();
        } else {
          gm.options.baseGridStatus = true;
          gm.createBaseGrid();
        }
        $(this).toggleClass(gm.options.gmDangerClass);
        // Make region editable
      }).on("click", ".gm-editholder", function() {
        var rteRegion = $(this);
        //if(!rteRegion.attr("contenteditable")){
        gm.rteControl("stop");
        $(".gm-editholder").removeClass('gm-editholder-active');
        $(this).addClass('gm-editholder-active');
        $('.gm-editing').removeClass(gm.options.gmEditClassActive);
        $(this).parent().addClass(gm.options.gmEditClassActive);
        rteRegion.attr("contenteditable", true);
        gm.rteControl("attach", rteRegion);
        //}
        /* Row settings */
      }).on("click", "a.gm-rowSettings", function() {
        var row = $(this).closest(gm.options.rowSelector);
        var drawer = row.find(".gm-rowSettingsDrawer");
        if (drawer.length > 0) {
          drawer.remove();
        } else {
          row.prepend(gm.generateRowSettings(row));
        }
        // Change Row ID via rowsettings
      }).on("input", "input.gm-rowSettingsID", function() {
        var row = $(this).closest(gm.options.rowSelector);
        row.attr("id", $(this).val());
        // Remove a class from a row via rowsettings
      }).on("click", ".gm-toggleRowClass", function(e) {
        var row = $(this).closest(gm.options.rowSelector);
        var theClass = $(this).text().trim();
        row.toggleClass(theClass);
        if (row.hasClass(theClass)) {
          $(this).addClass(gm.options.gmDangerClass);
        } else {
          $(this).removeClass(gm.options.gmDangerClass);
        }
        e.preventDefault();
        // Add new column to existing row
      }).on("click", "a.gm-colSettings", function(){
        var col=$(this).closest(gm.options.colSelector);
        var drawer=col.find(".gm-colSettingsDrawer");
          if(drawer.length > 0){
            drawer.remove();
          } else {
            col.prepend(gm.generateColSettings(col));
          }

        // Change Col ID via colsettings
      }).on("input", "input.gm-colSettingsID", function(){
        var col=$(this).closest(gm.options.colSelector);
        col.attr("id", $(this).val());
        // Remove a class from a col via rowsettings
      }).on("click", ".gm-togglecolClass", function(e){
        var col=$(this).closest(gm.options.colSelector);
        var theClass=$(this).text().trim();
        col.toggleClass(theClass);
        if(col.hasClass(theClass)){
          $(this).addClass(gm.options.gmDangerClass);
        } else {
          $(this).removeClass(gm.options.gmDangerClass);
        }
        e.preventDefault();
      // Add a column
      }).on("click", "a.gm-addColumn", function() {
        $(this).parent().after(gm.createCol(2));
      // Decrease Column Size
      }).on("click", "a.gm-colDecrease", function() {
        var col = $(this).closest("." + gm.options.gmEditClass);
        var t = gm.getColClass(col);
        if (t.colWidth > parseInt(gm.options.colResizeStep, 10)) {
          t.colWidth = (parseInt(t.colWidth, 10) - parseInt(gm.options.colResizeStep, 10));
          col.switchClass(t.colClass, gm.options.colClass + t.colWidth, 200);
        }
      // Increase Column Size
      }).on("click", "a.gm-colIncrease", function() {
        var col = $(this).closest("." + gm.options.gmEditClass);
        var t = gm.getColClass(col);
        if (t.colWidth < gm.options.colMax) {
          t.colWidth = (parseInt(t.colWidth, 10) + parseInt(gm.options.colResizeStep, 10));
          col.switchClass(t.colClass, gm.options.colClass + t.colWidth, 200);
        }
      // Decrease Column offset
      }).on("click", "a.gm-colDecreaseOffset", function() {
        var col = $(this).closest("." + gm.options.gmEditClass);
        var t = gm.getColOffsetClass(col);
        if (t.colOffsetWidth > 0) {
          t.colOffsetWidth = (parseInt(t.colOffsetWidth, 10) - parseInt(gm.options.colResizeStep, 10));
          col.switchClass(t.colOffsetClass, gm.options.colOffsetClass + t.colOffsetWidth, 200);
        }
      // Increase Column offset
      }).on("click", "a.gm-colIncreaseOffset", function() {
        var col = $(this).closest("." + gm.options.gmEditClass);
        var to = gm.getColOffsetClass(col);
        var tc = gm.getColClass(col);
        if (to.colOffsetWidth == "") { to.colOffsetWidth = 0; }
        if ((parseInt(to.colOffsetWidth, 10) + parseInt(tc.colWidth, 10)) < gm.options.colMax) {
          to.colOffsetWidth = (parseInt(to.colOffsetWidth, 10) + parseInt(gm.options.colResizeStep, 10));
          col.switchClass(to.colOffsetClass, gm.options.colOffsetClass + to.colOffsetWidth, 200);
        }
      // Reset all the things
      }).on("click", "a.gm-resetgrid", function() {
        canvas.html("");
        gm.reset();
      // Remove a col
      }).on("click", "a.gm-removeCol", function() {
        $(this).closest("." + gm.options.gmEditClass).animate({
          opacity: 'hide',
          width: 'hide',
          height: 'hide'
        }, 400, function() {
          $(this).remove();
        });
      // Remove a row
      }).on("click", "a.gm-removeRow", function() {
        $(this).closest("." + gm.options.gmEditClass).animate({
          opacity: 'hide',
          height: 'hide'
        }, 400, function() {
          $(this).remove();
        });
      // remove readmore row
      }).on("click", "a.gm-removeReadmoreRow", function() {
        $(this).closest("." + gm.options.gmEditClass).animate({
          opacity: 'hide',
          height: 'hide'
        }, 400, function() {
          $(this).remove();
        });
        $('#gm-addnew .readmore').toggleClass(gm.options.gmDangerClass);

      }).on('click', ('#' + gm.options.canvasId + ' ' + gm.options.colSelector), function() {
        if (gm.options.colSelectEnabled) {
          $(this).toggleClass(gm.options.gmEditClassSelected);
        }
        // For all the above, prevent default.
      }).on("click", "a.gm-removeCol, button.gm-basegrid, button.gm-mode, a.gm-resetgrid, a.gm-remove, a.gm-removeRow, a.gm-removeReadmoreRow, button.gm-preview, a.gm-viewsource, a.gm-addColumn, a.gm-colDecrease, a.gm-colIncrease, a.gm-colDecreaseOffset, a.gm-colIncreaseOffset", function(e) {
        gm.log("Clicked: " + $.grep((this).className.split(" "), function(v) {
          return v.indexOf('gm-') === 0;
        }).join());
        e.preventDefault();
      });

    };

    /*
     * Get the col-md-6 class, returning 6 as well from column
     * @col - column to look at
     * returns colClass: the full col-md-6 class
     * colWidth: just the last integer of classname
     */
    gm.getColClass = function(col) {
      var colClass = $.grep(col.attr("class").split(" "), function(v) {
        return v.indexOf(gm.options.colClass) === 0 && v.indexOf(gm.options.colOffsetClass) !== 0;
      }).join();
      var colWidth = colClass.replace(gm.options.colClass, "");
      return {
        colClass: colClass,
        colWidth: colWidth
      };
    };

    gm.getColOffsetClass = function(col) {
      var colOffsetClass = $.grep(col.attr("class").split(" "), function(v) {
        return v.indexOf(gm.options.colOffsetClass) === 0;
      }).join();
      var colOffsetWidth = colOffsetClass.replace(gm.options.colOffsetClass, "");
      return {
        colOffsetClass: colOffsetClass,
        colOffsetWidth: colOffsetWidth
      };
    };

    /*
     * Turns canvas into gm-editing mode - does most of the hard work here
     */
    gm.initCanvas = function() {
      // cache canvas
      var canvas = gm.$el.find("#" + gm.options.canvasId);
      var cols = canvas.find(gm.options.colSelector);
      var rows = canvas.find(gm.options.rowSelector);
      var rows_readmore = canvas.find(gm.options.readmoreSelector);
      gm.log("+ InitCanvas Running");
      // Show the template controls
      gm.$el.find("#gm-addnew").show();
      // Sort Rows First
      gm.activateReplaceReadmoreRows(rows_readmore);
      var rows_readmore = canvas.find(gm.options.rowReadmoreSelector);
      gm.activateReadmoreRows(rows_readmore);

      gm.activateRows(rows);
      // Now Columns
      gm.activateCols(cols);

      if (canvas.find(gm.options.readmoreSelector).length > 0) {
        $('#gm-addnew .readmore').addClass(gm.options.gmDangerClass);
      }

      // Make Rows sortable
      canvas.sortable({
        items: ".row-holder " + gm.options.rowSelector,
        axis: 'y',
        placeholder: gm.options.rowSortingClass,
        handle: "." + gm.options.gmToolClass + ":first-child",
        forcePlaceholderSize: true,
        opacity: 0.7,
        revert: true,
        tolerance: "pointer",
        cursor: "move"
      });
      // Make columns sortable
      rows.sortable({
        // connect all rows except the readmore row
        connectWith: ".row-holder " + gm.options.rowSelector +":not("+gm.options.rowReadmoreSelector+")",
        items: gm.options.colSelector,
        handle: "." + gm.options.gmToolClass + ":first-child",
        forcePlaceholderSize: true,
        opacity: 0.7,
        revert: true,
        tolerance: "pointer",
        cursor: "move",
        // it might be possible to drop a column behind a tool block, this line seems to fix this
        over: function(event,ui){
          ui.placeholder.insertAfter($(this).children('div.' + gm.options.gmToolClass + ':first'));
        },
        // fixes a bug on t3-framework and protostar: when dragging the last item the item jumps to the left
        helper: function(event, element) {
          var clone = $(element).clone();
          var w = $(element).outerWidth();
          var h = $(element).outerHeight();
          var top = $(element).position().top;
          clone.css({
              'top': top,
              'width': w+'px',
              'height': h+'px'
            });
          return clone;
        }
      });
      gm.status = true;
      gm.mode = "visual";
    };

    /*
     * Removes canvas editing mode or return the plain output of the canvas
     * @plain_output - if supplied the function returns the canvas html instead of showing it
     */
    gm.deinitCanvas = function(plain_output) {

      plain_output = plain_output || false;
      // return output string
      if (plain_output == true) {
        // remove previous output
        var output = '';
        // create output holder
        $('<div id="gm-plain-output"></div>').insertAfter("#" + gm.options.canvasId);
        // copy html to output div

        var content;

        /**
         * Determine the current edit mode and get the content based upon the resultant
         * context to prevent content in source mode from being lost on save, as such:
         *
         * edit mode (source): canvas.find('textarea').val()
         * edit mode (visual): canvas.html()
         */
        content = gm.mode !== "visual" ? $("#" + gm.options.canvasId + " .row-holder").find('textarea').val() : $("#" + gm.options.canvasId + " .row-holder").html();

        $('#gm-plain-output').css('display', 'none');
        $('#gm-plain-output').html(content);
        var canvas = $('#gm-plain-output');
        var cols = canvas.find(gm.options.colSelector);
        var rows = canvas.find(gm.options.rowSelector);
        var rows_readmore = canvas.find(gm.options.rowReadmoreSelector);
        // Sort Rows First
        gm.deactivateRows(rows);
        gm.deactivateReadmoreRows(rows_readmore);
        // Now Columns
        gm.deactivateCols(cols);
        // Clean markup
        // Clean column markup
        canvas.find(gm.options.colSelector)
          .removeAttr("style")
          .removeAttr("spellcheck")
          .removeClass("mce-content-body").end()
        // Clean img markup
        .find("img")
          .removeAttr("style")
          .addClass("img-responsive")
          .removeAttr("data-cke-saved-src")
          .removeAttr("data-mce-src").end()
        // Remove Tools
        .find("." + gm.options.gmToolClass).remove();
        output = canvas.html();
        $('#gm-plain-output').remove();
        return output;
      } else {
        var canvas = gm.$el.find("#" + gm.options.canvasId);
        var cols = canvas.find(gm.options.colSelector);
        var rows = canvas.find(gm.options.rowSelector);
        var rows_readmore = canvas.find(gm.options.rowReadmoreSelector);
        gm.log("- deInitCanvas Running");
        // Hide template control
        gm.$el.find("#gm-addnew").hide();
        // Sort Rows First
        gm.deactivateRows(rows);
        gm.deactivateReadmoreRows(rows_readmore);
        // Now Columns
        gm.deactivateCols(cols);
        // Clean markup
        gm.cleanup();
        gm.status = false;
      }
    };

    /*------------------------------------------ ROWS ---------------------------------------*/

    /*
     * Look for pre-existing rows and add editing tools as appropriate
     * @rows: elements to act on
     */
    gm.activateRows = function(rows) {
      gm.log("++ Activate Rows");
      rows.addClass(gm.options.gmEditClass).prepend(
        gm.toolFactory(gm.options.rowButtonsPrepend)
      ).append(
        gm.toolFactory(gm.options.rowButtonsAppend, true)
      );
    };

    gm.activateReplaceReadmoreRows = function(rows) {
      gm.log("-- Replace Readmore Rows");
      rows.replaceWith("<div class='" + gm.options.rowClass + " "+ gm.options.rowReadmoreClass + "'>" + gm.options.readmoreCode + "</div>");
    };

    gm.activateReadmoreRows = function(rows) {
      gm.log("++ Activate Readmore Rows");
      rows.addClass(gm.options.gmEditClass).prepend(
        gm.genericToolFactory(gm.options.rowReadmorePrepend)
      ).append(
        gm.toolFactory(gm.options.rowReadmoreButtonsAppend, true)
      );
    };

    /*
     * Look for pre-existing rows and remove editing classes as appropriate
     * @rows: elements to act on
     */
    gm.deactivateRows = function(rows) {
      gm.log("-- DeActivate Rows");
      rows.removeClass(gm.options.gmEditClass).removeClass("ui-sortable").removeAttr("style");
    };

    /*
     * Look for pre-existing readmore row and replace with Joomla code
     * @rows: elements to act on
     */
    gm.deactivateReadmoreRows = function(rows) {
      gm.log("-- DeActivate Readmore Rows");
      rows.replaceWith(gm.options.readmoreCode);
    };

    /*
     * Create a single row with appropriate editing tools & nested columns
     * @colWidths : array of css class integers, i.e [2,4,5]
     */
    gm.createRow = function(colWidths) {
      var row = $("<div/>", {
        "class": gm.options.rowClass + " " + gm.options.gmEditClass
      });
      $.each(colWidths, function(i, val) {
        row.append(gm.createCol(val));
      });
      row.prepend(gm.toolFactory(gm.options.rowButtonsPrepend))
        .append(gm.toolFactory(gm.options.rowButtonsAppend, true));
      gm.log("++ Created Row");
      return row;
    };

    /*
     * Create a single readmore row with appropriate editing tools & nested columns
     * @colWidths : array of css class integers, i.e [2,4,5]
     */
    gm.createReadmoreRow = function() {
      var row = $("<div/>", {
        "class": gm.options.rowClass + " " + gm.options.gmEditClass + " " + gm.options.rowReadmoreClass
      });

      row.append(gm.options.readmoreCode);

      row.prepend(gm.genericToolFactory(gm.options.rowReadmorePrepend))
        .append(gm.toolFactory(gm.options.rowReadmoreButtonsAppend, true));
      gm.log("++ Created Row");
      return row;
    };

    gm.createBaseGrid = function() {
      var baseGrid = $("<div/>", {
        "class": gm.options.baseGridClass + " " + gm.options.rowClass
      });
      for (i = 0; i < gm.options.colMax; i++) {
        baseGrid.append('<div class="gridbase-col ' + gm.options.colClass + 1 + '"><div class="gridbase-col-content"> </div></div>');
      }
      var canvas = gm.$el.find("#" + gm.options.canvasId);
      canvas.append(baseGrid);
    };

    gm.removeBaseGrid = function() {
      gm.$el.find("." + gm.options.baseGridClass).remove();
    };

    gm.testBaseGrid = function() {
      var gridBaseColumns = gm.$el.find(".gridbase-columns");
      var gridBaseCol = gridBaseColumns.find(".gridbase-col:first");
      var width = parseInt(gridBaseCol.width());
      var parentWidth = parseInt(gridBaseColumns.width());

      if (width != null && parentWidth != null && width > 0 && parentWidth > 0) {
        var percent = Math.round(100*width/parentWidth);
        if (percent >= 90) {
          gridBaseColumns.css("display", 'none');
        } else {
          gridBaseColumns.css("display", 'block');
        }
      }
    };


    /*
        Create the row specific settings box
        */
    gm.generateRowSettings = function(row) {
      // Row class toggle buttons
      var classBtns = [];
      $.each(gm.options.rowCustomClasses, function(i, val) {
        var btn = $("<button/>")
          .addClass("gm-toggleRowClass")
          .addClass(gm.options.controlButtonClass)
          .append(
            $("<span/>")
            .addClass(gm.options.controlButtonSpanClass)
        ).append(" " + val);

        if (row.hasClass(val)) {
          btn.addClass(gm.options.gmDangerClass);
        }
        classBtns.push(btn[0].outerHTML);
      });
      // Row settings drawer
      var html = $("<div/>")
        .addClass("gm-rowSettingsDrawer")
        .addClass(gm.options.gmToolClass)
        .addClass(gm.options.gmClearClass)
        .prepend($("<div />")
          .addClass(gm.options.gmBtnGroup)
          .addClass(gm.options.gmFloatLeft)
          .html(classBtns.join("")))
        .append($("<div />").addClass("pull-left").html(
          $("<label />").html(gm.options.rowID + " ").append(
            $("<input>").addClass("gm-rowSettingsID").attr({
              type: 'text',
              placeholder: gm.options.rowID,
              value: row.attr("id")
            })
          )
        ));

      return html[0].outerHTML;
    };


    /**
     * Create the col specific settings box
     * @method generateColSettings
     * @param {object} col - Column to act on
     * @return MemberExpression
     */
    gm.generateColSettings = function(col){
     // Col class toggle buttons
      var classBtns=[];
          $.each(gm.options.colCustomClasses, function(i, val){
              var btn=$("<button/>")
              .addClass("gm-togglecolClass")
              .addClass(gm.options.controlButtonClass)
              .append(
                $("<span/>")
                .addClass(gm.options.controlButtonSpanClass)
              ).append(" " + val);
              if(col.hasClass(val)){
                btn.addClass(gm.options.gmDangerClass);
              }
              classBtns.push(btn[0].outerHTML);
         });
      // col settings drawer
      var html=$("<div/>")
          .addClass("gm-colSettingsDrawer")
          .addClass(gm.options.gmToolClass)
          .addClass(gm.options.gmClearClass)
          .prepend($("<div />")
            .addClass(gm.options.gmBtnGroup)
            .addClass(gm.options.gmFloatLeft)
            .html(classBtns.join("")))
          .append($("<div />").addClass("pull-left").html(
            $("<label />").html(gm.options.colID + " ").append(
            $("<input>")
              .addClass("gm-colSettingsID")
              .attr({type: 'text', placeholder: gm.options.colID, value: col.attr("id")})
            )
          ));

      return html[0].outerHTML;
    };
    /*------------------------------------------ COLS ---------------------------------------*/
    /*
        Look for pre-existing columns and add editing tools as appropriate
          @rows: elements to act on
        */
    gm.activateCols = function(cols) {
      cols.addClass(gm.options.gmEditClass);

      $.each(cols, function(i, val) {
        var prepend = gm.toolFactory(gm.options.colButtonsPrepend) + "<div class='gm-editholder'>";
        var append = "</div>" + gm.toolFactory(gm.options.colButtonsAppend);
        var tempHTML = $(val).html();
        var colClass = $.grep((val).className.split(" "), function(v) {
          return v.indexOf(gm.options.colClass) === 0;
        }).join();
        $(val).html(prepend + tempHTML + append)
          .find(".gm-handle-col").attr("title", "Move " + colClass);
      });
      gm.log("++ Activate Cols Ran");
    };

    /*
        Look for pre-existing columns and removeediting tools as appropriate
          @rows: elements to act on
        */
    gm.deactivateCols = function(cols) {
      cols.removeClass(gm.options.gmEditClass)
        .removeClass(gm.options.gmEditClassActive)
        .removeClass(gm.options.gmEditClassSelected)
        .removeClass(gm.options.colOffsetClass + '0');
      $.each(cols, function(i, val) {
        var temp = $(val).find(".gm-editholder").html();
        $(val).html(temp);
      });
      gm.log("-- deActivate Cols Ran");
    };

    /*
        Create a single column with appropriate editing tools
        */
    gm.createCol = function(size) {
      var col = $("<div/>").addClass(gm.options.colClass + size)
        .addClass(gm.options.gmEditClass)
        .addClass(gm.options.colAdditionalClass)
        .html(gm.toolFactory(gm.options.colButtonsPrepend)).append(
          $("<div/>", {
            "class": "gm-editholder"
          }).html(gm.options.defaultColText)
      ).append(gm.toolFactory(gm.options.colButtonsAppend));
      gm.log("++ Created Column " + size);
      return col;
    };


    /*------------------------------------------ BTNs ---------------------------------------*/
    /*
         Returns an editing div with appropriate btns as passed in
         @btns Array of buttons (see options)
        */
    gm.toolFactory = function(btns, lastTool) {
      var tools = $("<div/>")
        .addClass(gm.options.gmToolClass)
        .addClass(gm.options.gmClearClass)
        .html(gm.buttonFactory(btns));
        if (lastTool == true) {
          tools.addClass(gm.options.gmToolClass + '-last');
        }
      return tools[0].outerHTML;
    };

    gm.genericToolFactory = function(elements) {
      var tools = $("<div/>")
        .addClass(gm.options.gmToolClass)
        .addClass(gm.options.gmClearClass)
        .html(gm.genericElementFactory(elements));
      return tools[0].outerHTML;
    };

    gm.genericElementFactory = function(elems) {
      var elements = [];
      $.each(elems, function(i, val) {
        elements.push("<" + val.element + " class='" + val.btnClass + "'><span class='" + val.iconClass + "'></span>&nbsp;" + val.title + "</" + val.element + "> ");
      });
      return elements.join("");
    };

    /*
         Returns html string of buttons
         @btns Array of button configurations (see options)
        */
    gm.buttonFactory = function(btns) {
      var buttons = [];
      $.each(btns, function(i, val) {
        buttons.push("<" + val.element + " title='" + val.title + "' class='" + val.btnClass + "'><span class='" + val.iconClass + "'></span>&nbsp;" + "</" + val.element + "> ");
      });
      return buttons.join("");
    };

    /*
         Basically just turns [2,4,6] into 2-4-6
        */
    gm.generateButtonClass = function(arr) {
      var string = "";
      $.each(arr, function(i, val) {
        string = string + "-" + val;
      });
      return string;
    };

    /*
     * click handlers for dynamic row template buttons
     * @colWidths - array of column widths, i.e [2,3,2]
     */
    gm.generateClickHandler = function(colWidths) {
      var string = "a.add" + gm.generateButtonClass(colWidths);
      var canvas = gm.$el.find("#" + gm.options.canvasId + ' .row-holder');
      gm.$el.on("click", string, function(e) {
        gm.log("Clicked " + string);
        if (gm.options.addRowPosition == 'bottom') {
          canvas.append(gm.createRow(colWidths));
        // default and 'top' position
        } else {
          canvas.prepend(gm.createRow(colWidths));
        }
        //gm.reset();
        var rows = canvas.find(gm.options.rowSelector);
        // Make columns sortable
        rows.sortable({
          // connect all rows except the readmore row
          connectWith: ".row-holder " + gm.options.rowSelector +":not("+gm.options.rowReadmoreSelector+")",
          items: gm.options.colSelector,
          handle: "." + gm.options.gmToolClass + ":first-child",
          forcePlaceholderSize: true,
          opacity: 0.7,
          revert: true,
          tolerance: "pointer",
          cursor: "move",
          // it might be possible to drop a column behind a tool block, this line seems to fix this
          over: function(event,ui){
            ui.placeholder.insertAfter($(this).children('div.' + gm.options.gmToolClass + ':first'));
          },
          // fixes a bug on t3-framework and protostar: when dragging the last item the item jumps to the left
          helper: function(event, element) {
            var clone = $(element).clone();
            var w = $(element).outerWidth();
            var h = $(element).outerHeight();
            var top = $(element).position().top;
            clone.css({
                'top': top,
                'width': w+'px',
                'height': h+'px'
              });
            return clone;
          }
        });
        e.preventDefault();
      });
    };

    /*
     * click handlers for readmore button
     */
    gm.generateReadmoreClickHandler = function() {
      var string = "a.readmore";
      var canvas = gm.$el.find("#" + gm.options.canvasId + ' .row-holder');
      // check if a readmore button is present initially
      gm.$el.on("click", string, function(e) {
        gm.log("Clicked " + string);
        $(this).toggleClass(gm.options.gmDangerClass);
        // remove readmore row
        if (canvas.find(gm.options.readmoreSelector).length > 0) {
          $(gm.options.readmoreSelector, canvas).closest("." + gm.options.gmEditClass).animate({
            opacity: 'hide',
            height: 'hide'
          }, 400, function() {
            $(this).remove();
          });
        // add readmore row
        } else {
          if (gm.options.addRowPosition == 'bottom') {
            canvas.append(gm.createReadmoreRow());
          // default and 'top' position
          } else {
            canvas.prepend(gm.createReadmoreRow());
          }
        }
        e.preventDefault();
      });
    };

    /*------------------------------------------ RTEs ---------------------------------------*/
    /*
     * Starts, stops, looks for and  attaches RTEs
     * @action - one of init|attach|stop
     *  @element object to attach to
     */
    gm.rteControl = function(action, element) {
      gm.log("RTE " + gm.options.rte + ' ' + action);

      switch (action) {
        case 'init':
          if (typeof window.CKEDITOR !== 'undefined') {
            gm.options.rte = 'ckeditor';
            gm.log("++ CKEDITOR Found");
            window.CKEDITOR.disableAutoInline = true;
          }
          if (typeof window.tinymce !== 'undefined') {
            gm.options.rte = 'tinymce';
            gm.log("++ TINYMCE Found");
          }
          break;
        case 'attach':
          switch (gm.options.rte) {
            case 'tinymce':
              //if(!(element).hasClass("mce-content-body")){
              //element.tinymce(gm.options.tinymce.config);
              gm.gridmanagerRelativeToAbsoluteURLs();
              tinyMCE.init(
                gm.options.tinymce.config
              );
              //}
              break;

            case 'ckeditor':
              $(element).ckeditor(gm.options.ckeditor);
              break;
            default:
              gm.log("No RTE specified for attach");
          }
          break; //end Attach
        case 'stop':
          switch (gm.options.rte) {
            case 'tinymce':
              // destroy TinyMCE
              gm.gridmanagerRelativeToAbsoluteURLs();
              window.tinymce.remove();
              gm.log("-- TinyMCE destroyed");
              break;

            case 'ckeditor':
              // destroy ckeditor
              for (var name in window.CKEDITOR.instances) {
                window.CKEDITOR.instances[name].destroy();
              }
              gm.log("-- CKEDITOR destroyed");
              break;

            default:
              gm.log("No RTE specified for stop");
          }
          break; //end stop

        default:
          gm.log("No RTE Action specified");
      }
    };

    /*
     * url conversion function for images relative to absolute
     */
    gm.gridmanagerRelativeToAbsoluteURLs = function() {
      $('.gm-editholder img').each(function() {
        // only process relative urls
        if ($(this).attr('src').indexOf('http://') === -1 && $(this).attr('src').indexOf('https://') === -1) {
          if ($(this).attr('src').indexOf(profil_bootstrap_editor_gridmanager_options.root) == -1) {
            $(this).attr('src', profil_bootstrap_editor_gridmanager_options.root + $(this).attr('src'));
          }
        }
      });
    }

    /*
     * url conversion function for images absolute to relative
     */
    gm.gridmanagerAbsoluteToRelativeURLs = function() {
      var re = new RegExp(profil_bootstrap_editor_gridmanager_options.root,"g");
      $('.editor-gridmanager textarea').val($('.editor-gridmanager textarea').val().replace(re, ''));
    }

    /*------------------------------------------ Useful functions ---------------------------------------*/

    /*
     * Quick reset
     */
    gm.reset = function() {
      gm.log("~~RESET~~");
      gm.deinitCanvas();
      gm.initCanvas();
    };

    /*
     * Remove all extraneous markup
     */
    gm.cleanup = function() {
      // cache canvas
      var canvas = gm.$el.find("#" + gm.options.canvasId);
      // Clean column markup
      canvas.find(gm.options.colSelector)
        .removeAttr("style")
        .removeAttr("spellcheck")
        .removeClass("mce-content-body").end()
      // Clean img markup
      .find("img")
        .removeAttr("style")
        .addClass("img-responsive")
        .removeAttr("data-cke-saved-src")
        .removeAttr("data-mce-src").end()
      // Remove Tools
      .find("." + gm.options.gmToolClass).remove();
      // Destroy any RTEs
      gm.rteControl("stop");
      gm.log("~~Cleanup Ran~~");
    };

    /*
     * Generic logging function
     */
    gm.log = function(logvar) {
      if (gm.options.debug) {
        if ((window['console'] !== undefined)) {
          window.console.log(logvar);
        }
      }
    };

    /*
     * Wrap data in <pre>
     * @value - code to wrap
     */
    gm.htmlEncode = function(value) {
      if (value) {
        return jQuery('<pre />').text(value).html();
      } else {
        return '';
      }
    };

    // Run initializer
    gm.init();
  };



  /*
   * Options which can be overridden by the .gridmanager() call on the requesting page
   */
  $.gridmanager.defaultOptions = {
    /*
     General Options---------------
    */
    // Debug to console
    debug: 0,

    // Are you columns selectable
    colSelectEnabled: true,

    /*
     * Canvas
     */

    // Canvas ID
    canvasId: "gm-canvas",

    /*
     * Control Bar
     */

    // Top Control Row ID
    controlId: "gm-controls",

    // Array of buttons for row templates, first element is used as label with name, second element is an array of columns
    controlButtons: [
      ['',[12]],
      ['',[6, 6]],
      ['',[4, 4, 4]],
      ['',[3, 3, 3, 3]],
      ['',[2, 2, 2, 2, 2, 2]],
      ['',[2, 8, 2]],
      ['',[4, 8]],
      ['',[8, 4]]
    ],

    // Default control button class
    controlButtonClass: "btn btn-xs btn-primary",

    // Default control button icon
    controlButtonSpanClass: "glyphicon glyphicon-plus-sign",

    // Control bar RH dropdown markup
    controlAppend: "<div class='btn-group pull-right'><button title='Edit Source Code' type='button' class='btn btn-xs btn-primary gm-mode'><span class='glyphicon glyphicon-chevron-left'></span><span class='glyphicon glyphicon-chevron-right'></span></button><button title='Preview' type='button' class='btn btn-xs btn-primary gm-preview'><span class='glyphicon glyphicon-eye-open'></span></button><button title='Grid' type='button' class='btn btn-xs btn-primary gm-basegrid'><span class='glyphicon glyphicon-align-justify'></span></button></div>",

    /*
     * General editing classes
     */

    // Standard edit class, applied to active elements
    gmEditClass: "gm-editing",
    gmEditClassSelected: "gm-editing-selected",
    gmEditClassActive: "gm-editing-active",

    // Tool bar class which are inserted dynamically
    gmToolClass: "gm-tools",

    // Clearing class, used on most toolbars
    gmClearClass: "clearfix",

    // generic float left and right
    gmFloatLeft: "pull-left",
    gmFloatRight: "pull-right",
    gmBtnGroup: "btn-group",
    gmDangerClass: "btn-success",

    /*
     * Rows
     */

    // Generic row class. change to row--fluid for fluid width in Bootstrap
    rowClass: "row",

    // additional class name for readmore row
    rowReadmoreClass: "row-readmore",

    // Used to find rows - change to div.row-fluid for fluid width
    rowSelector: "div.row",

    // Used to find the readmore row
    rowReadmoreSelector: "div.row-readmore",

    // Used to find the Joomla Readmore Code
    readmoreSelector: "#system-readmore",

    // Title of the readmore button
    readmoreTitle: "Readmore",

    // Tooltip for the readmore button
    readmoreTitleInfo: "Add readmore",

    // Tooltip for the 'add row'-buttons
    addRow: 'Add row',

    // class of background element when sorting rows
    rowSortingClass: "bg-warning",

    // Title of the label for the row ID input field
    rowID: "Row ID",

    // Buttons at the top of each row
    rowButtonsPrepend: [{
        title: "New Column",
        element: "a",
        btnClass: "gm-addColumn pull-left  ",
        iconClass: "glyphicon glyphicon-plus"
      }, {
        title: "Row Settings",
        element: "a",
        btnClass: "pull-right gm-rowSettings",
        iconClass: "glyphicon glyphicon-cog"
      }

    ],

    // Elements at the top of the readmore row
    rowReadmorePrepend: [{
        title: "Readmore",
        element: "span",
        btnClass: "pull-left  ",
        iconClass: ""
      }
    ],

    // Buttons at the bottom of each row
    rowButtonsAppend: [{
      title: "Remove row",
      element: "a",
      btnClass: "pull-right gm-removeRow",
      iconClass: "glyphicon glyphicon-trash"
    }],

    // Elements at the bottom of the readmore row
    rowReadmoreButtonsAppend: [{
      title: "Remove row",
      element: "a",
      btnClass: "pull-right gm-removeReadmoreRow",
      iconClass: "glyphicon glyphicon-trash"
    }],

    // Not sure about this one yet
    rowSettingControls: "Reserved for future use",

    // Custom row classes - add your own to make them available in the row settings
    rowCustomClasses: ["example-class", "test-class"],

    /*
     * Columns
     */

    // Generic row prefix: this should be the general span class, i.e span6 in BS2, col-md-6 (or you could change the whole thing to col-lg- etc)
    colClass: "col-md-",

    // Generic
    colOffsetClass: "col-md-offset-",

    // Wild card column selector - this means we can find all columns irrespective of col-md or col-lg etc.
    colSelector: "div[class*=col-]",

    // Additional column class to add (foundation needs columns, bs3 doesn't)
    colAdditionalClass: "",

    // Title of the label for the column ID input field
    colID: "Col ID",

    // Buttons to prepend to each column
    colButtonsPrepend: [{
      title: "Make Column Narrower",
      element: "a",
      btnClass: "gm-colDecrease pull-left",
      iconClass: "glyphicon glyphicon-minus-sign"
    }, {
      title: "Make Column Wider",
      element: "a",
      btnClass: "gm-colIncrease pull-left",
      iconClass: "glyphicon glyphicon-plus-sign"
    },{
      title: "Decrease Column Offset",
      element: "a",
      btnClass: "gm-colDecreaseOffset pull-left",
      iconClass: "glyphicon glyphicon-circle-arrow-left"
    }, {
      title: "Increase Column Offset",
      element: "a",
      btnClass: "gm-colIncreaseOffset pull-left",
      iconClass: "glyphicon glyphicon-circle-arrow-right"
    }, {
      title:"Column Settings",
      element: "a",
      btnClass: "pull-right gm-colSettings",
      iconClass: "glyphicon glyphicon-cog"
    }],

    // Buttons to append to each column
    colButtonsAppend: [{
      title: "Remove Column",
      element: "a",
      btnClass: "pull-right gm-removeCol",
      iconClass: "glyphicon glyphicon-trash"
    }],

    // Custom col classes - add your own to make them available in the col settings
    colCustomClasses: ["example-col-class","test-class"],

    // Maximum column span value: if you've got a 24 column grid via customised bootstrap, you could set this to 24.
    colMax: 12,

    // Column resizing +- value: this is also the colMin value, as columns won't be able to go smaller than this number (otherwise you hit zero and all hell breaks loose)
    colResizeStep: 1,

    baseGridClass : "gridbase-columns",
    baseGridStatus : false,
    defaultColText: "<p>Awaiting Content</p>",
    readmoreCode: "<hr id='system-readmore' />",

    // append or prepend new rows
    addRowPosition: 'top', // bottom is possible too
    /*
     Rich Text Editors---------------
  */
    tinymce: {
      config: {
        inline: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
      }
    },

    // Path to CK custom comfiguration
    ckeditor: {
      customConfig: ""
    }
  };

  // Expose as jquery function
  $.fn.gridmanager = function(options) {
    return this.each(function() {
      var element = $(this);
      var gridmanager = new $.gridmanager(this, options);
      element.data('gridmanager', gridmanager);
    });
  };

})(jQuery);
