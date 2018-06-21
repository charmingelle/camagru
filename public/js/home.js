let gallery = document.getElementById('gallery');

const appendImg = (sources) => {
	const images = sources.map(source => {
		let imageContainer = document.createElement('div');
		let image = document.createElement('img');
		let likeComment = document.createElement('div');
		let likeIcon = document.createElement('div');
		let like = document.createElement('div');
		let commentIcon = document.createElement('div');
		let comment = document.createElement('div');
		let login = document.createElement('div');
		
		imageContainer.classList.add('photo-container');
		image.src = source['url'];
		image.classList.add('photo');
		likeIcon.innerHTML = '<i class="fa fa-heart"></i>';
		like.innerHTML = source['likes'];
		like.classList.add('like');
		commentIcon.innerHTML = '<i class="fa fa-comment"></i>';
		comment.innerHTML = source['comments'];
		comment.classList.add('comment');
		likeComment.classList.add('like-comment');
		login.innerHTML = source['login'];
		login.classList.add('login');

		likeComment.append(likeIcon, like, commentIcon, comment, login);
		imageContainer.append(image, likeComment);
		return imageContainer;
	});
	gallery.append(...images);
}

fetch('/photos', {
	method: 'POST',
	credentials: 'include'
})
.then(response => response.json())
.then(appendImg)
.catch(error => console.log(error.message));
