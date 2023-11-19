export default class InstaWSAPI {
    static getImages(hashtag) {
        return fetch('/api/haircuts-from-insta', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(hashtag),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }
}