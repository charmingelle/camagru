<?php

class Comment {
	public static function getComments($id) {
		return DBConnect::sendQuery('SELECT id, comment, photo_id, login FROM comment WHERE photo_id = :photoId',
									['photoId' => $id])->fetchAll();
	}

	public static function deleteComment($id) {
		DBConnect::sendQuery('DELETE FROM comment WHERE id = :id AND login = :login',
							['id' => $id, 'login' => $_SESSION['auth-data']['login']]);
	}
}
