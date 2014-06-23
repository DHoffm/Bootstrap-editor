<?php

// no direct access
defined('_JEXEC') or die;
jimport('joomla.factory');

class plgEditorprofil_bootstrap_editor extends JPlugin
{

  /**
   * Method to handle the onInitEditor event.
   *  - Initialises the Editor
   *
   * @return  string  JavaScript Initialization string
   * @since 1.5
   */
  public function onInit() {
    $doc = JFactory::getDocument();
    $doc->addScriptVersion(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/jquery-ui.min.js');
    $doc->addScriptVersion(JURI::root() . '/media/editors/tinymce/tinymce.min.js');
    $doc->addScriptVersion(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager.js');
    $doc->addScriptVersion(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager-init.js');
    $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/grindmaster-bootstrap-grid.min.css');
    $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager.css');
  }
  /**
   * Get the editor content.
   *
   * @param string  $id   The id of the editor field.
   *
   * @return  string
   */
  public function onGetContent($id) {
    return "";
  }

  /**
   * Set the editor content.
   *
   * @param string  $id   The id of the editor field.
   * @param string  $html The content to set.
   *
   * @return  string
   */
  public function onSetContent($id, $html) {
    return "";
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
    $editor = '<div class="editor-gridmanager">';
    $editor .= html_entity_decode($content);
    $editor .= '</div>';
    $editor .= '<textarea name="' . $name . '" id="' . $id . '" cols="' . $col . '" rows="' . $row . '" style="width: ' . $width . '; height: ' . $height . ';">' . $content . '</textarea>';
    return $editor;
  }
}

?>