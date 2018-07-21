<?php
	session_start();

	function getRoot() {
		$sys_path = '/../';
		return (__DIR__ . $sys_path);
	}

	require_once(getRoot() . 'app/configs/db.php');
	require_once(getRoot() . 'app/controllers/AuthController.php');
	require_once(getRoot() . 'app/controllers/DataController.php');
	require_once(getRoot() . 'app/controllers/SiteMapController.php');
	require_once(getRoot() . 'app/controllers/Utils.php');
	require_once(getRoot() . 'app/core/DBConnect.php');
	require_once(getRoot() . 'app/core/Message.php');
	require_once(getRoot() . 'app/core/Route.php');
	require_once(getRoot() . 'app/modules/Account.php');
	require_once(getRoot() . 'app/modules/Comment.php');
	require_once(getRoot() . 'app/modules/Page.php');
	require_once(getRoot() . 'app/modules/Photos.php');
	require_once(getRoot() . 'app/modules/Stickers.php');
	require_once(getRoot() . 'app/modules/Validate.php');
	require_once(getRoot() . 'app/routes/web.php');
?>
