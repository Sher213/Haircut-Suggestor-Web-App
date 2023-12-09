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

    static GetRecommendations(prediction) {
        return fetch('/api/recommendations', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(prediction),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

    static GetHairStyleDescriptions(hairstyle) {
        return fetch('/api/get_hairstyle_desc', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(hairstyle),
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