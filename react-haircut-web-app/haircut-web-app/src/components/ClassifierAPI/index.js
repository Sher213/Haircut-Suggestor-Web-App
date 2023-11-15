export default class ClassifierAPI {
    static ClassifyImage(image){
        return fetch('/api/classify', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(image),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

    static FaceDetec(frame) {
        return fetch('/api/face-detec', {
            'method' : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify(frame),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

    static CreateDB(clfns){
        return fetch('/', {
            'method' : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : clfns
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }
}