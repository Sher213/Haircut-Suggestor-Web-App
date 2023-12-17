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

    static GetHaircutRecommendations(prediction) {
        return fetch('/api/haircut_recommendations', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(prediction),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

    static GetHaircutDescriptions(hairstyle) {
        return fetch('/api/get_haircut_descs', {
            'method': 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(hairstyle),
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

    static CreateDB(clfns){
        return fetch('/api/create_db', {
            'method' : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : clfns
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }
}