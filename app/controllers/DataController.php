<?php

class DataController {
	public static function getPhotos() {
		echo json_encode(Photos::getPhotos(Utils::getBodyFromJson()['lastId']));
	}
	
	public static function getLogin() {
		if (isset($_SESSION['auth-data']['login'])) {
			echo json_encode($_SESSION['auth-data']['login']);
		} else {
			echo json_encode(NULL);
		}
	}

	public static function getStickers() {
		echo json_encode(Stickers::getStickers());
	}

	public static function savePhoto() {
		Photos::savePhoto(Utils::getBodyFromJson()['layers']);
	}

	public static function getUserPhoto() {
		echo json_encode(Photos::getUserPhoto());
	}

	public static function deleteUserPhoto() {
		Photos::deleteUserPhoto(Utils::getBodyFromJson()['id']);
	}
	
	public static function getPhotoPrivate() {
		echo json_encode(Photos::getPhotoPrivate(Utils::getBodyFromJson()['id']));
	}
	
	public static function publish() {
		Photos::publish(Utils::getBodyFromJson()['id']);
	}

	public static function getLikeStatus() {
		Photos::getLikeStatus(Utils::getBodyFromJson()['id']);
	}

	public static function getLikes() {
		echo json_encode(Photos::getLikes(Utils::getBodyFromJson()['id']));
	}

	public static function likeDislike() {
		Photos::likeDislike(Utils::getBodyFromJson()['id']);
	}

	public static function addComment() {
		$body = Utils::getBodyFromJson();
		$login = Photos::getAuthor($body['photoId']);
		
		Photos::addComment($body['comment'], $body['photoId']);
		if (Account::getNotificationStatus($login)) {
			Account::notify($login, $body['comment'], $_SESSION['auth-data']['login']);
		}
	}

	public static function increaseCommentCount() {
		echo json_encode(Photos::increaseCommentCount(Utils::getBodyFromJson()['id']));
	}

	public static function decreaseCommentCount() {
		echo json_encode(Photos::decreaseCommentCount(Utils::getBodyFromJson()['id']));
	}

	public static function getComments() {
		echo json_encode(Comment::getComments(Utils::getBodyFromJson()['id']));
	}

	public static function deleteComment() {
		Comment::deleteComment(Utils::getBodyFromJson()['id']);
	}

	public static function getNotificationStatus() {
		echo json_encode(['notificationStatus' => Account::getNotificationStatus($_SESSION['auth-data']['login'])]);
	}

	public static function changeNotificationStatus() {
		Account::changeNotificationStatus();
	}

	public static function getLastPublicPhotoId() {
		echo json_encode(Photos::getLastPublicPhotoId());
	}
}
