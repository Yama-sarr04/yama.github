var peer;
var myStream;

function ajoutVideo(stream) {
    try {
        var video = document.createElement('video');
        video.autoplay = true;
        video.controls = true;
        video.srcObject = stream;
        document.getElementById('participants').appendChild(video);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la vidéo :", error);
    }
}

function register() {
    var name = document.getElementById('name').value.trim();
    if (!name) {
        alert("Veuillez entrer un nom valide !");
        return;
    }

    try {
        peer = new Peer(name);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                myStream = stream;
                ajoutVideo(stream);

                document.getElementById('register').style.display = 'none';
                document.getElementById('userAdd').style.display = 'block';
                document.getElementById('userShare').style.display = 'block';

                peer.on('call', function(call) {
                    call.answer(myStream);
                    call.on('stream', function(remoteStream) {
                        ajoutVideo(remoteStream);
                    });
                });
            })
            .catch((err) => {
                console.error("Échec de l'accès au flux local :", err);
                alert("Impossible d'accéder à votre caméra/micro. Vérifiez vos permissions !");
            });

    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    }
}

function appelUser() {
    var name = document.getElementById('add').value.trim();
    document.getElementById('add').value = "";

    if (!name) {
        alert("Veuillez entrer un nom valide !");
        return;
    }

    try {
        if (!peer || !myStream) {
            alert("Erreur : vous devez d'abord vous enregistrer !");
            return;
        }

        var call = peer.call(name, myStream);
        call.on('stream', function(remoteStream) {
            ajoutVideo(remoteStream);
        });

    } catch (error) {
        console.error("Erreur lors de l'appel :", error);
    }
}

function addScreenShare() {
    var name = document.getElementById('share').value.trim();
    document.getElementById('share').value = "";

    if (!name) {
        alert("Veuillez entrer un nom valide !");
        return;
    }

    if (!peer) {
        alert("Vous devez être enregistré avant de partager l'écran !");
        return;
    }

    navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: true })
        .then((stream) => {
            let call = peer.call(name, stream);
            call.on('stream', function(remoteStream) {
                ajoutVideo(remoteStream);
            });
        })
        .catch((err) => {
            console.error("Erreur lors du partage d'écran :", err);
            alert("Impossible de partager l'écran. Vérifiez les permissions !");
        });
}
