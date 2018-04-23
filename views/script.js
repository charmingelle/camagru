// function post(path, headers = {}) {
// 	return new Promise((resolve, reject) => {
// 		var xhr = new XMLHttpRequest();

// 		xhr.onreadystatechange = () => {
// 			if (xhr.readyState === 4) {
// 				if (xhr.status > 200) {
// 					reject(xhr, xhr.status);
// 				} else {
// 					resolve(JSON.parse(xhr.responseText));
// 				}
// 			}
// 		};

// 		xhr.open('POST', path);

// 		Object.keys(headers).forEach(key => {
// 			xhr.setRequestHeader(key, headers[key]);
// 		});

// 		xhr.send();
// 	});
// }

alert('here');

fetch('localhost:7777/photos', {method: 'POST'})
.then(function(response) {
	console.log(response);
	return response;
})
.catch(function(error) {
	console.log(error.message);
});
