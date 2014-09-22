<?php
/**
 * @version   1.0
 * @package   Profil bootstrap editor(plugin)
 * @author    David Hoffmann - http://www.profilpr.de
 * @copyright Copyright (c) 2014 Profilpr. All rights reserved.
 * @license   GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

// no direct access
defined('_JEXEC') or die;
jimport('joomla.factory');
jimport('joomla.plugin.plugin');
jimport('joomla.plugin.helper');

class plgEditorprofil_bootstrap_editor extends JPlugin {

  /**
   * Load the language file on instantiation.
   *
   * @var    boolean
   * @since  3.1
   */
   protected $autoloadLanguage = true;

  /**
   * Method to handle the onInitEditor event.
   *  - Initialises the Editor
   *
   * @return  string  JavaScript Initialization string
   * @since 1.5
   */
  public function onInit() {

    $doc = JFactory::getDocument();

    JLoader::import( 'joomla.version' );
    $version = new JVersion();
    if (version_compare( $version->RELEASE, '2.5', '<=')) {
      if(JFactory::getApplication()->get('jquery') !== true) {
        // load jQuery here
        $doc->addScript('https://code.jquery.com/jquery-1.11.0.min.js');
        JFactory::getApplication()->set('jquery', true);
        $tinymce_path = '/media/editors/tinymce/jscripts/tiny_mce/tiny_mce.js';
      }
    } else {
      JHtml::_('behavior.framework');
      JHtml::_('jquery.framework');
      $tinymce_path = '/media/editors/tinymce/tinymce.min.js';
    }

    $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/jquery-ui.min.js');

    $plugin = JPluginHelper::getPlugin('editors', 'tinymce');
    // check if tinymce is enabled
    if (is_object($plugin)) {
      $doc->addScript(JURI::root() . $tinymce_path);
    }

    $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager.js');
    $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager-init.js');
    $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager.css');
    $bootstrap_mode = (int) $this->params->get('mode', 0);

    // we still need to load this for both bootstrap modes because the gridmanager editor gui relies on glyphicons from bootstrap 3
    $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager-bootstrap-grid.min.css');
    // bootstrap 3
    if ($bootstrap_mode != 0) {
      $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/bootstrap.min.js');
    }
  }

  /**
   * Customized copy of onInit() from plugins/editors/tinymce/tinymce.php
   *
   * @param   string  $name  The name of the editor
   *
   * @return  boolean
   */
  public function loadTinyMceJSConfig() {
    $language = JFactory::getLanguage();

    $config = array();
    // load tinymce plugins
    $plugin = JPluginHelper::getPlugin('editors', 'tinymce');
    // check if tinymce is enabled
    if (is_object($plugin)) {
      // get plugins parameters
      $params = new JRegistry($plugin->params);

      // build tinymce options array for js
      $tinymce_options = array();

      $tinymce_options['mode'] = $params->get('mode', 1);
      $tinymce_options['theme'] = 'modern';
      $tinymce_options['skin'] = $params->get('skin', '0');

      switch ($tinymce_options['skin']) {
        case '0':
        default:
          $tinymce_options['skin'] = "lightgray";
      }

      $tinymce_options['entity_encoding'] = $params->get('entity_encoding', 'raw');
      $tinymce_options['langMode'] = $params->get('lang_mode', 0);
      $tinymce_options['langPrefix'] = $params->get('lang_code', 'en');

      if ($tinymce_options['langMode']) {
        if (file_exists(JPATH_ROOT . "/media/editors/tinymce/langs/" . $language->getTag() . ".js")) {
          $tinymce_options['langPrefix'] = $language->getTag();
        }
        elseif (file_exists(JPATH_ROOT . "/media/editors/tinymce/langs/" . substr($language->getTag(), 0, strpos($language->getTag(), '-')) . ".js")) {
          $tinymce_options['langPrefix'] = substr($language->getTag(), 0, strpos($language->getTag(), '-'));
        } else {
          $tinymce_options['langPrefix'] = "en";
        }
      }

      $tinymce_options['text_direction'] = 'ltr';

      if ($language->isRTL()) {
        $tinymce_options['text_direction'] = 'rtl';
      }

      $tinymce_options['use_content_css'] = $params->get('content_css', 1);
      $tinymce_options['content_css_custom'] = $params->get('content_css_custom', '');

      /*
       * Lets get the default template for the site application
       */
      $db   = JFactory::getDbo();
      $query  = $db->getQuery(true)
        ->select('template')
        ->from('#__template_styles')
        ->where('client_id=0 AND home=' . $db->quote('1'));

      $db->setQuery($query);
      $tinymce_options['template'] = $db->loadResult();

      $tinymce_options['content_css'] = '';

      $tinymce_options['templates_path'] = JPATH_SITE . '/templates';

      // Loading of css file for 'styles' dropdown
      if ( $tinymce_options['content_css_custom'] ) {
        // If URL, just pass it to $content_css
        if (strpos($tinymce_options['content_css_custom'], 'http') !== false) {
          $tinymce_options['content_css'] = $tinymce_options['content_css_custom'];
        // If it is not a URL, assume it is a file name in the current template folder
        } else {
          $tinymce_options['content_css'] = JUri::root() . 'templates/' . $tinymce_options['template'] . '/css/' . $tinymce_options['content_css_custom'];

          // Issue warning notice if the file is not found (but pass name to $content_css anyway to avoid TinyMCE error
          if (!file_exists($tinymce_options['templates_path'] . '/' . $tinymce_options['template'] . '/css/' . $tinymce_options['content_css_custom'])) {
            $msg = sprintf(JText::_('PLG_TINY_ERR_CUSTOMCSSFILENOTPRESENT'), $tinymce_options['content_css_custom']);
            JLog::add($msg, JLog::WARNING, 'jerror');
          }
        }
      } else {
        // Process when use_content_css is Yes and no custom file given
        if ($tinymce_options['use_content_css']) {
          // First check templates folder for default template
          // if no editor.css file in templates folder, check system template folder
          if (!file_exists($tinymce_options['templates_path'] . '/' . $tinymce_options['template'] . '/css/editor.css')) {
            // If no editor.css file in system folder, show alert
            if (!file_exists($tinymce_options['templates_path'] . '/system/css/editor.css')) {
              JLog::add(JText::_('PLG_TINY_ERR_EDITORCSSFILENOTPRESENT'), JLog::WARNING, 'jerror');
            } else {
              $tinymce_options['content_css'] = JUri::root() . 'templates/system/css/editor.css';
            }
          } else {
            $tinymce_options['content_css'] = JUri::root() . 'templates/' . $tinymce_options['template'] . '/css/editor.css';
          }
        }
      }

      // add own bootstrap css here for tinymce to recognize it
      $tinymce_options['content_css'] .= '"/><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" type="text/css">';

      $tinymce_options['relative_urls'] = $params->get('relative_urls', '1');

      if ($tinymce_options['relative_urls']) {
        // Relative
        $tinymce_options['relative_urls'] = "true";
      } else {
        // Absolute
        $tinymce_options['relative_urls'] = "false";
      }

      $tinymce_options['newlines'] = $params->get('newlines', 0);

      if ($tinymce_options['newlines']) {
        // Break
        $tinymce_options['force_br_newlines'] = true;
        $tinymce_options['force_p_newlines'] = false;
        $tinymce_options['forced_root_block'] = '';
      } else {
        // Paragraph
        $tinymce_options['force_br_newlines'] = false;
        $tinymce_options['force_p_newlines'] = true;
        $tinymce_options['forced_root_block'] = 'p';
      }

      $tinymce_options['invalid_elements'] = $params->get('invalid_elements', 'script,applet,iframe');
      $tinymce_options['extended_elements'] = $params->get('extended_elements', '');

      // Advanced Options
      $tinymce_options['html_height'] = $params->get('html_height', '550');
      $tinymce_options['html_width'] = $params->get('html_width', '750');

      // Image advanced options
      $tinymce_options['image_advtab'] = $params->get('image_advtab', 1);

      if ($tinymce_options['image_advtab']) {
        $tinymce_options['image_advtab'] = "true";
      } else {
        $tinymce_options['image_advtab'] = "false";
      }

      // The param is true false, so we turn true to both rather than showing vertical resize only
      $tinymce_options['resizing'] = $params->get('resizing', '1');

      if ($tinymce_options['resizing'] || $tinymce_options['resizing'] == 'true') {
        $tinymce_options['resize'] = 'both';
      } else {
        $tinymce_options['resize'] = 'false';
      }

      $tinymce_options['toolbar1_add'] = array();
      $tinymce_options['toolbar2_add'] = array();
      $tinymce_options['toolbar3_add'] = array();
      $tinymce_options['toolbar4_add'] = array();
      $tinymce_options['elements'] = array();
      $tinymce_options['plugins'] = array('autolink', 'lists', 'image', 'charmap', 'print', 'preview', 'anchor', 'pagebreak', 'code', 'save', 'textcolor', 'importcss');
      $tinymce_options['toolbar1_add'][] = 'bold';
      $tinymce_options['toolbar1_add'][] = 'italic';
      $tinymce_options['toolbar1_add'][] = 'underline';
      $tinymce_options['toolbar1_add'][] = 'strikethrough';

      // Alignment buttons
      $tinymce_options['alignment'] = $params->get('alignment', 1);

      if ($tinymce_options['alignment']) {
        $tinymce_options['toolbar1_add'][] = '|';
        $tinymce_options['toolbar1_add'][] = 'alignleft';
        $tinymce_options['toolbar1_add'][] = 'aligncenter';
        $tinymce_options['toolbar1_add'][] = 'alignright';
        $tinymce_options['toolbar1_add'][] = 'alignjustify';
      }

      $tinymce_options['toolbar1_add'][] = '|';
      $tinymce_options['toolbar1_add'][] = 'styleselect';
      $tinymce_options['toolbar1_add'][] = '|';
      $tinymce_options['toolbar1_add'][] = 'formatselect';

      // Fonts
      $tinymce_options['fonts'] = $params->get('fonts', 1);

      if ($tinymce_options['fonts']) {
        $tinymce_options['toolbar1_add'][] = 'fontselect';
        $tinymce_options['toolbar1_add'][] = 'fontsizeselect';
      }

      // Search & replace
      $tinymce_options['searchreplace'] = $params->get('searchreplace', 1);

      if ($tinymce_options['searchreplace']) {
        $tinymce_options['plugins'][]  = 'searchreplace';
        $tinymce_options['toolbar2_add'][] = 'searchreplace';
      }

      $tinymce_options['toolbar2_add'][] = '|';
      $tinymce_options['toolbar2_add'][] = 'bullist';
      $tinymce_options['toolbar2_add'][] = 'numlist';
      $tinymce_options['toolbar2_add'][] = '|';
      $tinymce_options['toolbar2_add'][] = 'outdent';
      $tinymce_options['toolbar2_add'][] = 'indent';
      $tinymce_options['toolbar2_add'][] = '|';
      $tinymce_options['toolbar2_add'][] = 'undo';
      $tinymce_options['toolbar2_add'][] = 'redo';
      $tinymce_options['toolbar2_add'][] = '|';

      // Insert date and/or time plugin
      $tinymce_options['insertdate'] = $params->get('insertdate', 1);

      if ($tinymce_options['insertdate']) {
        $tinymce_options['plugins'][]  = 'insertdatetime';
        $tinymce_options['toolbar4_add'][] = 'inserttime';
      }

      // Link plugin
      $tinymce_options['link'] = $params->get('link', 1);

      if ($tinymce_options['link']) {
        $tinymce_options['plugins'][]  = 'link';
        $tinymce_options['toolbar2_add'][] = 'link';
        $tinymce_options['toolbar2_add'][] = 'unlink';
      }

      $tinymce_options['toolbar2_add'][] = 'anchor';
      $tinymce_options['toolbar2_add'][] = 'image';
      $tinymce_options['toolbar2_add'][] = '|';
      $tinymce_options['toolbar2_add'][] = 'code';

      // Colours
      $tinymce_options['colours'] = $params->get('colours', 1);

      if ($tinymce_options['colours']) {
        $tinymce_options['toolbar2_add'][] = '|';
        $tinymce_options['toolbar2_add'][] = 'forecolor,backcolor';
      }

      // Fullscreen
      $tinymce_options['fullscreen'] = $params->get('fullscreen', 1);

      if ($tinymce_options['fullscreen']) {
        $tinymce_options['plugins'][]  = 'fullscreen';
        $tinymce_options['toolbar2_add'][] = '|';
        $tinymce_options['toolbar2_add'][] = 'fullscreen';
      }

      // Table
      $tinymce_options['table'] = $params->get('table', 1);

      if ($tinymce_options['table']) {
        $tinymce_options['plugins'][]  = 'table';
        $tinymce_options['toolbar3_add'][] = 'table';
        $tinymce_options['toolbar3_add'][] = '|';
      }

      $tinymce_options['toolbar3_add'][] = 'subscript';
      $tinymce_options['toolbar3_add'][] = 'superscript';
      $tinymce_options['toolbar3_add'][] = '|';
      $tinymce_options['toolbar3_add'][] = 'charmap';

      // Emotions
      $tinymce_options['smilies'] = $params->get('smilies', 1);

      if ($tinymce_options['smilies']) {
        $tinymce_options['plugins'][]  = 'emoticons';
        $tinymce_options['toolbar3_add'][] = 'emoticons';
      }

      // Media plugin
      $tinymce_options['media'] = $params->get('media', 1);

      if ($tinymce_options['media']) {
        $tinymce_options['plugins'][] = 'media';
        $tinymce_options['toolbar3_add'][] = 'media';
      }

      // Horizontal line
      $tinymce_options['hr'] = $params->get('hr', 1);

      if ($tinymce_options['hr']) {
        $tinymce_options['plugins'][]  = 'hr';
        $tinymce_options['elements'][] = 'hr[id|title|alt|class|width|size|noshade]';
        $tinymce_options['toolbar3_add'][] = 'hr';
      } else {
        $tinymce_options['elements'][] = 'hr[id|class|title|alt]';
      }

      // RTL/LTR buttons
      $tinymce_options['directionality'] = $params->get('directionality', 1);

      if ($tinymce_options['directionality']) {
        $tinymce_options['plugins'][] = 'directionality';
        $tinymce_options['toolbar3_add'][] = 'ltr rtl';
      }

      if ($tinymce_options['extended_elements'] != "") {
        $tinymce_options['elements'] = explode(',', $tinymce_options['extended_elements']);
      }

      $tinymce_options['toolbar4_add'][] = 'cut';
      $tinymce_options['toolbar4_add'][] = 'copy';

      // Paste
      $tinymce_options['paste'] = $params->get('paste', 1);

      if ($tinymce_options['paste']) {
        $tinymce_options['plugins'][]  = 'paste';
        $tinymce_options['toolbar4_add'][] = 'paste';
      }

      $tinymce_options['toolbar4_add'][] = '|';

      // Visualchars
      $tinymce_options['visualchars'] = $params->get('visualchars', 1);

      if ($tinymce_options['visualchars']) {
        $tinymce_options['plugins'][]  = 'visualchars';
        $tinymce_options['toolbar4_add'][] = 'visualchars';
      }

      // Visualblocks
      $tinymce_options['visualblocks'] = $params->get('visualblocks', 1);

      if ($tinymce_options['visualblocks']) {
        $tinymce_options['plugins'][]  = 'visualblocks';
        $tinymce_options['toolbar4_add'][] = 'visualblocks';
      }

      // Non-breaking
      $tinymce_options['nonbreaking'] = $params->get('nonbreaking', 1);

      if ($tinymce_options['nonbreaking']) {
        $tinymce_options['plugins'][]  = 'nonbreaking';
        $tinymce_options['toolbar4_add'][] = 'nonbreaking';
      }

      // Blockquote
      $tinymce_options['blockquote'] = $params->get('blockquote', 1);

      if ($tinymce_options['blockquote']) {
        $tinymce_options['toolbar4_add'][] = 'blockquote';
      }

      // Template
      $tinymce_options['template'] = $params->get('template', 1);

      if ($tinymce_options['template']) {
        $tinymce_options['plugins'][]  = 'template';
        $tinymce_options['toolbar4_add'][] = 'template';

        // Note this check for the template_list.js file will be removed in Joomla 4.0
        if (is_file(JPATH_ROOT . "/media/editors/tinymce/templates/template_list.js")) {
          // If using the legacy file we need to include and input the files the new way
          $str = file_get_contents(JPATH_ROOT . "/media/editors/tinymce/templates/template_list.js");

          // Find from one [ to the last ]
          preg_match_all('/\[.*\]/', $str, $matches);

          $tinymce_options['templates'] = array();

          // Set variables
          foreach ($matches['0'] as $match) {
            preg_match_all('/\".*\"/', $match, $values);
            $result = trim($values["0"]["0"], '"');
            $final_result = explode(',', $result);
            $tinymce_options['templates'][] = array('title' => trim($final_result['0'], ' " '), 'description' => trim($final_result['2'], ' " ') . "', url: '" . JUri::root() . trim($final_result['1'], ' " '));
          }
        } else {
          $tinymce_options['templates'][] = array(
            'title' => 'Layout', 'description' => 'HTMLLayout', 'url' => JUri::root() . 'media/editors/tinymce/templates/layout1.html',
            'title' => 'Simple snippet', 'description' => 'Simple HTML snippet', 'url' => JUri::root() . 'media/editors/tinymce/templates/snippet1.html',
          );
        }
      } else {
        $tinymce_options['templates'] = '';
      }

      // Print
      $tinymce_options['print'] = $params->get('print', 1);

      if ($tinymce_options['print']) {
        $tinymce_options['plugins'][] = 'print';
        $tinymce_options['toolbar4_add'][] = '|';
        $tinymce_options['toolbar4_add'][] = 'print';
        $tinymce_options['toolbar4_add'][] = 'preview';
      }

      // Spellchecker
      $tinymce_options['spell'] = $params->get('spell', 0);

      if ($tinymce_options['spell']) {
        $tinymce_options['plugins'][] = 'spellchecker';
        $tinymce_options['toolbar4_add'][] = '|';
        $tinymce_options['toolbar4_add'][] = 'spellchecker';
      }

      // Wordcount
      $tinymce_options['wordcount']  = $params->get('wordcount', 1);

      if ($tinymce_options['wordcount']) {
        $tinymce_options['plugins'][] = 'wordcount';
      }

      // Advlist
      $tinymce_options['advlist']  = $params->get('advlist', 1);

      if ($tinymce_options['advlist']) {
        $tinymce_options['plugins'][]  = 'advlist';
      }

      // Autosave
      $tinymce_options['autosave'] = $params->get('autosave', 1);

      if ($tinymce_options['autosave']) {
        $tinymce_options['plugins'][]  = 'autosave';
      }

      // Context menu
      $tinymce_options['contextmenu'] = $params->get('contextmenu', 1);

      if ($tinymce_options['contextmenu']) {
        $tinymce_options['plugins'][]  = 'contextmenu';
      }

      $tinymce_options['custom_plugin'] = $params->get('custom_plugin', '');

      if ($tinymce_options['custom_plugin'] != "") {
        $tinymce_options['plugins'][] = $tinymce_options['custom_plugin'];
      }

      $tinymce_options['custom_button'] = $params->get('custom_button', '');

      if ($tinymce_options['custom_button'] != "") {
        $tinymce_options['toolbar4_add'][] = $tinymce_options['custom_button'];
      }

      // Prepare config variables
      $tinymce_options['plugins'] = implode(',', $tinymce_options['plugins']);
      $tinymce_options['elements'] = implode(',', $tinymce_options['elements']);

      // Prepare config variables
      $tinymce_options['toolbar1'] = implode(' ', $tinymce_options['toolbar1_add']);
      $tinymce_options['toolbar2'] = implode(' ', $tinymce_options['toolbar2_add']);
      $tinymce_options['toolbar3'] = implode(' ', $tinymce_options['toolbar3_add']);
      $tinymce_options['toolbar4'] = implode(' ', $tinymce_options['toolbar4_add']);

      // See if mobileVersion is activated
      $tinymce_options['mobileVersion'] = $params->get('mobile', 0);

      /**
       * Shrink the buttons if not on a mobile or if mobile view is off.
       * If mobile view is on force into simple mode and enlarge the buttons
      **/
      $app  = JFactory::getApplication();
      if (!$app->client->mobile) {
        $tinymce_options['toolbar_items_size'] = "small";
      } elseif ($tinymce_options['mobileVersion'] == false) {
        $tinymce_options['toolbar_items_size'] = '';
      } else {
        $tinymce_options['toolbar_items_size'] = '';
        $tinymce_options['mode'] = 0;
      }

      switch ($tinymce_options['mode']) {
        case 0: /* Simple mode*/
          $config['tinymce'] = array(
            'config' => array(
              'directionality' => $tinymce_options['text_direction'],
              'selector' => '.gm-editholder-active',
              'language' => $tinymce_options['langPrefix'],
              'mode' => "specific_textareas",
              'autosave_restore_when_empty' => false,
              'skin' => $tinymce_options['skin'],
              'theme' => $tinymce_options['theme'],
              'schema' => "html5",
              'menubar' => false,
              'toolbar1' => "bold italics underline strikethrough | undo redo | bullist numlist",
              'inline_styles' => true,
              'gecko_spellcheck' => true,
              'entity_encoding' => $tinymce_options['entity_encoding'],
              'force_br_newlines' => $tinymce_options['force_br_newlines'],
              'force_p_newlines' => $tinymce_options['force_p_newlines'],
              'forced_root_block' => $tinymce_options['forced_root_block'],
              // tinymce seems to mess up embeded images in article posts when using window.tinymce.remove()
              // the next 3 lines seem to do the trick on supplying relative urls, who needs absolute urls anyway
              // if somebody stumbles upon this and needs a fix give me a call
              'relative_urls' => $tinymce_options['relative_urls'], // original tinymce config: $tinymce_options['relative_urls'],
              'remove_script_host' => true, // original tinymce config:  false
              'document_base_url' => JUri::root(), // original tinymce config: JUri::root()
              'content_css' => $tinymce_options['content_css']
            ),
          );
          break;
        case 1:
        default: /* Advanced mode*/
          $toolbar1 = "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect | bullist numlist";
          $toolbar2 = "outdent indent | undo redo | link unlink anchor image code | hr table | subscript superscript | charmap";
          $config['tinymce'] = array(
            'config' => array(
              'directionality' => $tinymce_options['text_direction'],
              'language' => $tinymce_options['langPrefix'],
              'mode' => 'specific_textareas',
              'autosave_restore_when_empty' => false,
              'skin' => $tinymce_options['skin'],
              'theme' => $tinymce_options['theme'],
              'schema' => 'html5',
              'selector' => '.gm-editholder-active',
              'inline_styles' => true,
              'gecko_spellcheck' => true,
              'entity_encoding' => $tinymce_options['entity_encoding'],
              'extended_valid_elements' => $tinymce_options['elements'],
              'force_br_newlines' => $tinymce_options['force_br_newlines'],
              'force_p_newlines' => $tinymce_options['force_p_newlines'],
              'forced_root_block' => $tinymce_options['forced_root_block'],
              'invalid_elements' => $tinymce_options['invalid_elements'],
              'plugins' => 'table link image code charmap autolink lists importcss',
              'toolbar1' => $tinymce_options['toolbar1'],
              'toolbar2' => $tinymce_options['toolbar2'],
              'removed_menuitems' => 'newdocument',
              // tinymce seems to mess up embeded images in article posts when using window.tinymce.remove()
              // the next 3 lines seem to do the trick on supplying relative urls, who needs absolute urls anyway
              // if somebody stumbles upon this and needs a fix give me a call
              'relative_urls' => $tinymce_options['relative_urls'], // original tinymce config: $tinymce_options['relative_urls'],
              'remove_script_host' => true, // original tinymce config:  false
              'document_base_url' => JUri::root(), // original tinymce config: JUri::root()
              'content_css' => $tinymce_options['content_css'],
              'importcss_append' => true,
              'resize' => $tinymce_options['resize'],
              'height' => $tinymce_options['html_height'],
              'width' => $tinymce_options['html_width'],
            ),
          );
        break;

        case 2: /* Extended mode*/
          $tinymce_options['rel_list'][] = array('title' => 'Alternate', 'value' => 'alternate');
          $tinymce_options['rel_list'][] = array('title' => 'Author', 'value' => 'author');
          $tinymce_options['rel_list'][] = array('title' => 'Bookmark', 'value' => 'bookmark');
          $tinymce_options['rel_list'][] = array('title' => 'Help', 'value' => 'help');
          $tinymce_options['rel_list'][] = array('title' => 'License', 'value' => 'license');
          $tinymce_options['rel_list'][] = array('title' => 'Lightbox', 'value' => 'lightbox');
          $tinymce_options['rel_list'][] = array('title' => 'Next', 'value' => 'next');
          $tinymce_options['rel_list'][] = array('title' => 'No Follow', 'value' => 'nofollow');
          $tinymce_options['rel_list'][] = array('title' => 'No Referrer', 'value' => 'noreferrer');
          $tinymce_options['rel_list'][] = array('title' => 'Prefetch', 'value' => 'prefetch');
          $tinymce_options['rel_list'][] = array('title' => 'Prev', 'value' => 'prev');
          $tinymce_options['rel_list'][] = array('title' => 'Search', 'value' => 'search');
          $tinymce_options['rel_list'][] = array('title' => 'Tag', 'value' => 'tag');

          $config['tinymce'] = array(
            'config' => array(
              'directionality' => $tinymce_options['text_direction'],
              'language' => $tinymce_options['langPrefix'],
              'mode' => 'specific_textareas',
              'autosave_restore_when_empty' => false,
              'skin' => $tinymce_options['skin'],
              'theme' => $tinymce_options['theme'],
              'schema' => 'html5',
              'selector' => '.gm-editholder-active',
              'inline_styles' => true,
              'gecko_spellcheck' => true,
              'entity_encoding' => $tinymce_options['entity_encoding'],
              'extended_valid_elements' => $tinymce_options['elements'],
              'force_br_newlines' => $tinymce_options['force_br_newlines'],
              'force_p_newlines' => $tinymce_options['force_p_newlines'],
              'forced_root_block' => $tinymce_options['forced_root_block'],
              'invalid_elements' => $tinymce_options['invalid_elements'],
              'plugins' => $tinymce_options['plugins'],
              'toolbar1' => $tinymce_options['toolbar1'],
              'toolbar2' => $tinymce_options['toolbar2'],
              'toolbar3' => $tinymce_options['toolbar3'],
              'toolbar4' => $tinymce_options['toolbar4'],
              'removed_menuitems' => 'newdocument',
              // tinymce seems to mess up embeded images in article posts when using window.tinymce.remove()
              // the next 3 lines seem to do the trick on supplying relative urls, who needs absolute urls anyway
              // if somebody stumbles upon this and needs a fix give me a call
              'relative_urls' => $tinymce_options['relative_urls'], // original tinymce config: $tinymce_options['relative_urls'],
              'remove_script_host' => true, // original tinymce config:  false
              'document_base_url' => JUri::root(), // original tinymce config: JUri::root()
              'rel_list' => $tinymce_options['rel_list'],
              'templates' => $tinymce_options['templates'],
              'content_css' => $tinymce_options['content_css'],
              'importcss_append' => true,
              'resize' => $tinymce_options['resize'],
              'image_advtab' => $tinymce_options['image_advtab'],
              'height' => $tinymce_options['html_height'],
              'width' => $tinymce_options['html_width'],
            ),
          );
          break;
      }
      if (!empty($tinymce_options['toolbar_items_size'])) {
        $config['tinymce']['config']['toolbar_items_size'] = $tinymce_options['toolbar_items_size'];
      }
    }

    $bootstrap_mode = (int) $this->params->get('mode', 0);

    // bootstrap 2, joomla 3.0 default
    if ($bootstrap_mode == 0) {
      $config['colClass'] = 'span';
      // TODO: joomla isis admin template set margin-left via .row-fluid [class*="span"] { margin-left: 15px; } which overrides the offset class margins
      // not sure how to deal with it at the moment
      $config['colOffsetClass'] = 'offset';
      $config['colSelector'] = 'div[class*=span]';
      $config['rowClass'] = 'row-fluid';
      $config['rowSelector'] = 'div.row-fluid';
      $config['bootstrapStyles'] = array();
      $config['bootstrapStyles']['buttons'] = array();
      $config['bootstrapStyles']['buttons']['settings'] = array();
      $config['bootstrapStyles']['buttons']['settings']['enabled'] = true;
      $config['bootstrapStyles']['buttons']['types'] = array();
      $config['bootstrapStyles']['buttons']['types']['large'] = 'btn-large';
      $config['bootstrapStyles']['buttons']['types']['default'] = 'btn-default-size';
      $config['bootstrapStyles']['buttons']['types']['small'] = 'btn-small';
      $config['bootstrapStyles']['buttons']['types']['extraSmall'] = 'btn-mini';
      $config['bootstrapStyles']['contextual_backgrounds'] = array();
      $config['bootstrapStyles']['contextual_backgrounds']['settings'] = array();
      $config['bootstrapStyles']['contextual_backgrounds']['settings']['enabled'] = false;
    // bootstrap 3, gridmanager default
    } else {
      $config['bootstrapStyles'] = array();
      $config['bootstrapStyles']['buttons'] = array();
      $config['bootstrapStyles']['buttons']['settings'] = array();
      $config['bootstrapStyles']['buttons']['settings']['enabled'] = true;
      $config['bootstrapStyles']['buttons']['types'] = array();
      $config['bootstrapStyles']['buttons']['types']['large'] = 'btn-lg';
      $config['bootstrapStyles']['buttons']['types']['default'] = 'btn-default-size';
      $config['bootstrapStyles']['buttons']['types']['small'] = 'btn-sm';
      $config['bootstrapStyles']['buttons']['types']['extraSmall'] = 'btn-xs';
      $config['bootstrapStyles']['contextual_backgrounds'] = array();
      $config['bootstrapStyles']['contextual_backgrounds']['settings'] = array();
      $config['bootstrapStyles']['contextual_backgrounds']['settings']['enabled'] = true;
    }

    // check for custom row classes
    $row_classes = $this->params->get('rowClasses', 'example-class, test-class');

    if (!empty($row_classes)) {
      $config['rowCustomClasses'] = array_map('trim', explode(',', $row_classes));
    }

    // check for custom col classes
    $addRowPosition = $this->params->get('addRowPosition', 'top');
    if (!empty($addRowPosition)) {
      $config['addRowPosition'] = $addRowPosition;
    }

    // check for custom col classes
    $col_classes = $this->params->get('colClasses', 'example-class, test-class');

    if (!empty($col_classes)) {
      $config['colCustomClasses'] = array_map('trim', explode(',', $col_classes));
    }

    $row_presets = $this->params->get('rowPresets', "['Full';12],['Half';6,6],['Third';4,4,4],['Quarter';3,3,3,3],['Large middle',2,8,2],['Large right';4,8],['Large left';8,4]");
    // remove whitespaces
    $row_presets = trim($row_presets);
    // remove first bracket
    $row_presets = ltrim($row_presets, '[');
    // remove last bracket
    $row_presets = rtrim($row_presets, ']');
    // explode on brackets + comma
    $controlButtons = explode('],[', $row_presets);
    // explode childs
    $finalArray = array();
    if (!empty($controlButtons)) {
      foreach ($controlButtons as $cKey => $cValue) {
        $tmpControlButtons = explode(';', $cValue);
        // get the columns
        $controlButtonsCols = explode(',', $tmpControlButtons[1]);
        // add the label
        $controlButtonsPreset = array(str_replace("'", "", $tmpControlButtons[0]));
        // combine the results
        array_push($controlButtonsPreset, $controlButtonsCols);
        $finalArray[] = $controlButtonsPreset;
      }
    }

    if (!empty($controlButtons)) {
      $config['controlButtons'] = array_values($finalArray);
    }

    /* translation for gridmanager gui */

    $config['translations']['defaultColText'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_DEFAULT_COL_TEXT', true);
    $config['defaultColText'] = $config['translations']['defaultColText'];

    $config['translation']['colButtonsPrepend']['narrower'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_PREPEND_NARROWER', true);
    $config['translation']['colButtonsPrepend']['wider'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_PREPEND_WIDER', true);
    $config['translation']['colButtonsPrepend']['increase_offset'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_PREPEND_INCREASE_OFFSET', true);
    $config['translation']['colButtonsPrepend']['decrease_offset'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_PREPEND_DECREASE_OFFSET', true);
    $config['translation']['colButtonsPrepend']['col_settings'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_PREPEND_COL_SETTINGS', true);
    $config['translation']['colButtonsAppend']['remove_col'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_BUTTONS_APPEND_REMOVE_COL', true);

    $config['translation']['rowButtonsAppend']['remove_row'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ROW_BUTTONS_APPEND_REMOVE_ROW', true);
    $config['translation']['rowButtonsPrepend']['new_column'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ROW_BUTTONS_PREPEND_NEW_COL', true);
    $config['translation']['rowButtonsPrepend']['row_settings'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ROW_BUTTONS_PREPEND_ROW_SETTINGS', true);

    $config['translation']['rowReadmorePrepend']['title'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ROW_READMORE_PREPEND_TITLE', true);

    $config['translation']['controlAppend']['source'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_CONTROL_APPEND_BUTTONS_SOURCE', true);
    $config['translation']['controlAppend']['preview'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_CONTROL_APPEND_BUTTONS_PREVIEW', true);
    $config['translation']['controlAppend']['grid'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_CONTROL_APPEND_BUTTONS_GRID', true);

    $config['translation']['colID'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_COL_ID', true);
    $config['translation']['rowID'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ROW_ID', true);

    $config['translation']['readmoreTitleInfo'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_READMORE_TITLE_INFO', true);
    $config['translation']['addRow'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_ADD_ROW', true);

    $config['translation']['bootstrapContextBackground'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_CONTEXT_BACKGROUND', true);
    $config['translation']['bootstrapButtons'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS', true);
    $config['translation']['bootstrapButtonsLarge'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_SIZE_LARGE', true);
    $config['translation']['bootstrapButtonsDefault'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_SIZE_DEFAULT', true);
    $config['translation']['bootstrapButtonsSmall'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_SIZE_SMALL', true);
    $config['translation']['bootstrapButtonsExtraSmall'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_SIZE_EXTRA_SMALL', true);

    $config['translation']['bootstrapButtonsStyleDefault'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_DEFAULT', true);
    $config['translation']['bootstrapButtonsStylePrimary'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_PRIMARY', true);
    $config['translation']['bootstrapButtonsStyleSuccess'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_SUCCESS', true);
    $config['translation']['bootstrapButtonsStyleInfo'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_INFO', true);
    $config['translation']['bootstrapButtonsStyleWarning'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_WARNING', true);
    $config['translation']['bootstrapButtonsStyleDanger'] = JText::_('PLG_PROFIL_BOOTSTRAP_EDITOR_BOOTSTRAP_BUTTONS_STYLE_DANGER', true);

    $config['colButtonsPrepend'] = array();
    $config['colButtonsAppend'] = array();
    $config['rowButtonsAppend'] = array();
    $config['rowReadmoreButtonsAppend'] = array();
    $config['rowButtonsPrepend'] = array();
    $config['rowReadmorePrepend'] = array();

    // col narrower button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsPrepend']['narrower'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'gm-colDecrease pull-left';
    $gui_button->iconClass = 'glyphicon glyphicon-minus-sign';
    $config['colButtonsPrepend'][] = $gui_button;

    // col wider button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsPrepend']['wider'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'gm-colIncrease pull-left';
    $gui_button->iconClass = 'glyphicon glyphicon-plus-sign';
    $config['colButtonsPrepend'][] = $gui_button;

    // col increase offset button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsPrepend']['decrease_offset'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'gm-colDecreaseOffset pull-left';
    $gui_button->iconClass = 'glyphicon glyphicon-circle-arrow-left';
    $config['colButtonsPrepend'][] = $gui_button;

    // col increase offset button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsPrepend']['increase_offset'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'gm-colIncreaseOffset pull-left';
    $gui_button->iconClass = 'glyphicon glyphicon-circle-arrow-right';
    $config['colButtonsPrepend'][] = $gui_button;

    // col settings button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsPrepend']['col_settings'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-right gm-colSettings';
    $gui_button->iconClass = 'glyphicon glyphicon-cog';
    $config['colButtonsPrepend'][] = $gui_button;

    // col remove button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['colButtonsAppend']['remove_col'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-right gm-removeCol';
    $gui_button->iconClass = 'glyphicon glyphicon-trash';
    $config['colButtonsAppend'][] = $gui_button;

    // row remove button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['rowButtonsAppend']['remove_row'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-right gm-removeRow';
    $gui_button->iconClass = 'glyphicon glyphicon-trash';
    $config['rowButtonsAppend'][] = $gui_button;

    // row add new col button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['rowButtonsPrepend']['new_column'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-left gm-addColumn';
    $gui_button->iconClass = 'glyphicon glyphicon-plus';
    $config['rowButtonsPrepend'][] = $gui_button;

    // row settings button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['rowButtonsPrepend']['row_settings'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-right gm-rowSettings';
    $gui_button->iconClass = 'glyphicon glyphicon-cog';
    $config['rowButtonsPrepend'][] = $gui_button;

    // readmore row remove button
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['rowButtonsAppend']['remove_row'];
    $gui_button->element = 'a';
    $gui_button->btnClass = 'pull-right gm-removeReadmoreRow';
    $gui_button->iconClass = 'glyphicon glyphicon-trash';
    $config['rowReadmoreButtonsAppend'][] = $gui_button;

    // readmore row title
    $gui_button = new stdClass();
    $gui_button->title = $config['translation']['rowReadmorePrepend']['title'];
    $gui_button->element = 'span';
    $gui_button->btnClass = 'pull-left';
    $gui_button->iconClass = '';
    $config['rowReadmorePrepend'][] = $gui_button;

    // title for readmore button beside col buttons
    $config['readmoreTitle'] = $config['translation']['rowReadmorePrepend']['title'];

    // mode buttons
    $config['controlAppend'] = "<div class='btn-group pull-right'><button title='" . $config['translation']['controlAppend']['source'] . "' type='button' class='btn btn-xs btn-primary gm-mode'><span class='glyphicon glyphicon-chevron-left'></span><span class='glyphicon glyphicon-chevron-right'></span></button><button title='" . $config['translation']['controlAppend']['preview'] . "' type='button' class='btn btn-xs btn-primary gm-preview'><span class='glyphicon glyphicon-eye-open'></span></button><button title='" . $config['translation']['controlAppend']['grid'] . "' type='button' class='btn btn-xs btn-primary gm-basegrid'><span class='glyphicon glyphicon-align-justify'></span></button></div>";

    // label for col id
    $config['colID'] = $config['translation']['colID'];

    // label for row id
    $config['rowID'] = $config['translation']['rowID'];

    $config['readmoreTitleInfo'] = $config['translation']['readmoreTitleInfo'];
    $config['addRow'] = $config['translation']['addRow'];

    /* end translation for gridmanager gui */

    $config['root'] = JUri::root();

    $config['widgetkit'] = self::getWidgetkitList();

    $doc = JFactory::getDocument();
    // add tinymce js config
    $js = 'var profil_bootstrap_editor_gridmanager_options =' . json_encode( $config ) . ';';
    $doc->addScriptDeclaration($js);
  }


  /**
   * If Widgetkit is enabled return a list of al widgets to use in gridmanagers tinymce.
   *
   * @return  array of widgets or false
   */
  public function getWidgetkitList() {
    if (file_exists(JPATH_ADMINISTRATOR . '/components/com_widgetkit/widgetkit.php') && JComponentHelper::isEnabled('com_widgetkit', true)) {
      $widget_path = JPATH_ADMINISTRATOR . '/components/com_widgetkit/helpers/widget.php';
      $widgetkit_path = JPATH_ADMINISTRATOR . '/components/com_widgetkit/widgetkit.php';
      if (file_exists($widget_path) && file_exists($widgetkit_path)) {
        require_once($widgetkit_path);
        require_once($widget_path);
        // get widgetkit
        $widgetkit = Widgetkit::getInstance();
        $widgetKitHelper = new WidgetWidgetkitHelper($widgetkit);
        $widgets = $widgetKitHelper->all();
        if (!empty($widgets)) {
          $result = array();
          foreach ($widgets as $w_id => $w_value) {
            $result[$w_value->type][$w_value->id] =  $w_value->name;
          }
          return $result;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  /**
   * Display the editor area.
   *
   * @param string  $name   The control name.
   * @param string  $html   The contents of the text area.
   * @param string  $width    The width of the text area (px or %).
   * @param string  $height   The height of the text area (px or %).
   * @param int   $col    The number of columns for the textarea.
   * @param int   $row    The number of rows for the textarea.
   * @param boolean $buttons  True and the editor buttons will be displayed.
   * @param string  $id     An optional ID for the textarea (note: since 1.6). If not supplied the name is used.
   * @param string  $asset
   * @param object  $author
   * @param array $params   Associative array of editor parameters.
   *
   * @return  string
   */
  public function onDisplay($name, $content, $width, $height, $col, $row, $buttons = true, $id = null, $asset = null, $author = null, $params = array()) {
    self::loadTinyMceJSConfig();
    $editor = '<div class="editor-gridmanager">';
    // attach article content
    $editor .= html_entity_decode($content);
    $editor .= '</div>';
    // include hidden textarea for saving the content + bootstrap grid data
    $editor .= '<textarea name="' . $name . '" id="' . $id . '" class="editor-gridmanager-textarea" cols="' . $col . '" rows="' . $row . '" style="width: ' . $width . '; height: ' . $height . ';">' . $content . '</textarea>';
    $editor .= '<div class="editor-gridmanager-xtd-buttons">' . $this->_displayButtons($id, $buttons, $asset, $author) . '</div>';
    return $editor;
  }


  /**
   * TinyMCE WYSIWYG Editor - get the editor content
   *
   * @param   string  $editor  The name of the editor
   *
   * @return  string
   */
  public function onGetContent($editor)
  {
    return 'tinyMCE.get(\'' . $editor . '\').getContent();';
  }

  /**
   * TinyMCE WYSIWYG Editor - set the editor content
   *
   * @param   string  $editor  The name of the editor
   * @param   string  $html    The html to place in the editor
   *
   * @return  string
   */
  public function onSetContent($editor, $html)
  {
    return 'tinyMCE.get(\'' . $editor . '\').setContent(' . $html . ');';
  }

  /**
   * Inserts html code into the editor
   *
   * @param   string  $name  The name of the editor
   *
   * @return  boolean
   */
  public function onGetInsertMethod($name)
  {
    $doc = JFactory::getDocument();

    $js = "
      function isBrowserIE()
      {
        return navigator.appName==\"Microsoft Internet Explorer\";
      }

      function jInsertEditorText( text, editor )
      {
        if (isBrowserIE())
        {
          if (window.parent.tinyMCE)
          {
            window.parent.tinyMCE.selectedInstance.selection.moveToBookmark(window.parent.global_ie_bookmark);
          }
        }
        tinyMCE.execCommand('mceInsertContent', false, text);
      }

      var global_ie_bookmark = false;

      function IeCursorFix()
      {
        if (isBrowserIE())
        {
          tinyMCE.execCommand('mceInsertContent', false, '');
          global_ie_bookmark = tinyMCE.activeEditor.selection.getBookmark(false);
        }
        return true;
      }";

    $doc->addScriptDeclaration($js);

    return true;
  }

  /**
   * Displays the editor buttons.
   *
   * @param   string  $name     The editor name
   * @param   mixed   $buttons  [array with button objects | boolean true to display buttons]
   * @param   string  $asset    The object asset
   * @param   object  $author   The author.
   *
   * @return  string HTML
   */
  private function _displayButtons($name, $buttons, $asset, $author) {
    $return = '';

    $args = array(
      'name'  => $name,
      'event' => 'onGetInsertMethod'
    );

    $results = (array) $this->update($args);

    if ($results)
    {
      foreach ($results as $result)
      {
        if (is_string($result) && trim($result))
        {
          $return .= $result;
        }
      }
    }

    if (is_array($buttons) || (is_bool($buttons) && $buttons))
    {
      $buttons = $this->_subject->getButtons($name, $buttons, $asset, $author);
      $image_button = array();
      foreach($buttons as $b_id => $b_value) {
        if ($b_value->name != 'arrow-down') {
          $b_value->class .= " gridmanager-joomla-btn";
          $gridmanager_buttons[] = $b_value;
        }
      }
      if (!empty($gridmanager_buttons)) {
        $return .= JLayoutHelper::render('joomla.tinymce.buttons', $gridmanager_buttons);
      } else {
        $return .= '';
      }
    }

    return $return;
  }
}

?>