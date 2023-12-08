export default class InstaWSAPI {
    static GetImages(hashtags) {
        return fetch('/api/haircuts-from-insta', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(hashtags),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }
}