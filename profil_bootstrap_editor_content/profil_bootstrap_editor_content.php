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

class plgContentprofil_bootstrap_editor_content extends JPlugin
{
  public function plgContentprofil_bootstrap_editor_content( &$subject, $params ) {
    parent::__construct($subject, $params);
  }

  public function onContentPrepare($context, &$row, &$params, $page = 0) {
    $app  = JFactory::getApplication();
    if ($app->isAdmin()) return;
    if (JPluginHelper::isEnabled('editors', 'profil_bootstrap_editor')) {
      $plugin = JPluginHelper::getPlugin('editors', 'profil_bootstrap_editor');
      $editor_params = new JRegistry($plugin->params);
      $bootstrap_mode = (int) $editor_params->get('mode', 0);
      if ($bootstrap_mode !== 0) {
        $doc = JFactory::getDocument();
        JLoader::import( 'joomla.version' );
        $version = new JVersion();
        if (version_compare( $version->RELEASE, '2.5', '<=')) {
          if(JFactory::getApplication()->get('jquery') !== true) {
            // load jQuery here
            $doc->addScript('https://code.jquery.com/jquery-1.11.0.min.js');
            JFactory::getApplication()->set('jquery', true);
          }
        } else {
            JHtml::_('jquery.framework');
        }
        $doc->addScript(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/bootstrap.min.js');
        $doc->addStyleSheet(JURI::root() . '/plugins/editors/profil_bootstrap_editor/js/gridmanager/gridmanager-bootstrap-grid.min.css');
        //$doc->addScript("http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js");
        //$doc->addStyleSheet("http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css");
        // frontend fix for dropwdown article options
        $doc->addScriptDeclaration('jQuery(document).ready(function(){ jQuery(".dropdown-toggle").dropdown(); });');
      }
    }
  }
}
?>