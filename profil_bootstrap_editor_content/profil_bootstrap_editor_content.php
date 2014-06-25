<?php

// no direct access
defined('_JEXEC') or die;
jimport('joomla.factory');
jimport('joomla.plugin.plugin');
jimport('joomla.plugin.helper');

class plgContentprofil_bootstrap_editor_content extends JPlugin
{
  public function plgContentprofil_bootstrap_editor_content( &$subject, $params ) {
    parent::__construct($subject, $params);
  }
  
  public function onContentPrepare($context, &$row, &$params, $page = 0) {
    $app  = JFactory::getApplication();
    if ($app->isAdmin()) return;
    if (JPluginHelper::isEnabled('editors', 'profil_bootstrap_editor')) {
      $doc = JFactory::getDocument();
      $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/bootstrap.min.js');
      $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager-bootstrap-grid.min.css');
    }
  }
}

?>