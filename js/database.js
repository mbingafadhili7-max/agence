// Base de données JavaScript pour le site
class Database {
    constructor() {
        this.init();
    }

    init() {
        // Initialiser les données si elles n'existent pas
        if (!localStorage.getItem('mvElShaddaiData')) {
            var initialData = {
                destinations: [
                    {
                        id: 1,
                        nom: "Îles Paradisiaques",
                        description: "Découvrez des îles magnifiques aux eaux cristallines et plages de sable fin.",
                        image: "https://via.placeholder.com/300x200?text=Îles+Paradisiaques"
                    },
                    {
                        id: 2,
                        nom: "Croisière Côtière",
                        description: "Explorez les côtes pittoresques et les villages de pêcheurs authentiques.",
                        image: "https://via.placeholder.com/300x200?text=Croisière+Côtière"
                    }
                ],
                tarifs: [
                    {
                        id: 1,
                        destinationId: 1,
                        prix: 150
                    },
                    {
                        id: 2,
                        destinationId: 2,
                        prix: 120
                    }
                ],
                offres: [
                    {
                        id: 1,
                        titre: "Première Croisière -20%",
                        description: "Profitez de 20% de réduction sur votre première croisière avec nous.",
                        reduction: 20,
                        image: "https://via.placeholder.com/300x200?text=Offre+Spéciale"
                    }
                ],
                commentaires: [
                    {
                        id: 1,
                        nom: "Jean Dupont",
                        email: "jean.dupont@example.com",
                        message: "Excellente expérience ! Le personnel était très attentionné et les paysages magnifiques.",
                        date: "2023-10-15",
                        approuve: true
                    },
                    {
                        id: 2,
                        nom: "Marie Lambert",
                        email: "marie.lambert@example.com",
                        message: "Voyage inoubliable, je recommande vivement cette agence !",
                        date: "2023-10-10",
                        approuve: true
                    }
                ],
                reservations: [
                    {
                        id: 1,
                        nom: "Pierre Martin",
                        email: "pierre.martin@example.com",
                        telephone: "0123456789",
                        destinationId: 1,
                        date: "2023-11-20",
                        nombre: 2,
                        message: "Nous célébrons notre anniversaire de mariage.",
                        statut: "en attente",
                        dateReservation: "2023-10-18"
                    }
                ],
                personnalisation: {
                    couleurPrincipale: "#1a5276",
                    couleurSecondaire: "#3498db",
                    imageFond: "",
                    logo: ""
                }
            };
            this.saveData(initialData);
        }
    }

    // Récupérer toutes les données
    getData() {
        return JSON.parse(localStorage.getItem('mvElShaddaiData')) || {};
    }

    // Sauvegarder les données
    saveData(data) {
        localStorage.setItem('mvElShaddaiData', JSON.stringify(data));
    }

    // Gestion des destinations
    getDestinations() {
        return this.getData().destinations || [];
    }

    addDestination(destination) {
        var data = this.getData();
        destination.id = Date.now(); // ID unique basé sur le timestamp
        data.destinations.push(destination);
        this.saveData(data);
        return destination;
    }

    updateDestination(id, updatedDestination) {
        var data = this.getData();
        var index = data.destinations.findIndex(d => d.id === id);
        if (index !== -1) {
            data.destinations[index] = { ...data.destinations[index], ...updatedDestination };
            this.saveData(data);
            return true;
        }
        return false;
    }

    deleteDestination(id) {
        var data = this.getData();
        data.destinations = data.destinations.filter(d => d.id !== id);
        this.saveData(data);
        return true;
    }

    // Gestion des tarifs
    getTarifs() {
        return this.getData().tarifs || [];
    }

    updateTarif(destinationId, prix) {
        var data = this.getData();
        var index = data.tarifs.findIndex(t => t.destinationId === destinationId);
        if (index !== -1) {
            data.tarifs[index].prix = prix;
        } else {
            data.tarifs.push({
                id: Date.now(),
                destinationId,
                prix
            });
        }
        this.saveData(data);
        return true;
    }

    // Gestion des offres
    getOffres() {
        return this.getData().offres || [];
    }

    addOffre(offre) {
        var data = this.getData();
        offre.id = Date.now();
        data.offres.push(offre);
        this.saveData(data);
        return offre;
    }

    updateOffre(id, updatedOffre) {
        var data = this.getData();
        var index = data.offres.findIndex(o => o.id === id);
        if (index !== -1) {
            data.offres[index] = { ...data.offres[index], ...updatedOffre };
            this.saveData(data);
            return true;
        }
        return false;
    }

    deleteOffre(id) {
        var data = this.getData();
        data.offres = data.offres.filter(o => o.id !== id);
        this.saveData(data);
        return true;
    }

    // Gestion des commentaires
    getCommentaires() {
        return this.getData().commentaires || [];
    }

    getCommentairesApprouves() {
        return this.getCommentaires().filter(c => c.approuve);
    }

    addCommentaire(commentaire) {
        var data = this.getData();
        commentaire.id = Date.now();
        commentaire.date = new Date().toISOString().split('T')[0];
        commentaire.approuve = false; // Les commentaires doivent être approuvés par l'admin
        data.commentaires.push(commentaire);
        this.saveData(data);
        return commentaire;
    }

    approuverCommentaire(id) {
        var data = this.getData();
        var index = data.commentaires.findIndex(c => c.id === id);
        if (index !== -1) {
            data.commentaires[index].approuve = true;
            this.saveData(data);
            return true;
        }
        return false;
    }

    supprimerCommentaire(id) {
        var data = this.getData();
        data.commentaires = data.commentaires.filter(c => c.id !== id);
        this.saveData(data);
        return true;
    }

    // Gestion des réservations
    getReservations() {
        return this.getData().reservations || [];
    }

    addReservation(reservation) {
        var data = this.getData();
        reservation.id = Date.now();
        reservation.statut = "en attente";
        reservation.dateReservation = new Date().toISOString().split('T')[0];
        data.reservations.push(reservation);
        this.saveData(data);
        return reservation;
    }

    accepterReservation(id) {
        var data = this.getData();
        var index = data.reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            data.reservations[index].statut = "acceptée";
            this.saveData(data);
            return true;
        }
        return false;
    }

    refuserReservation(id) {
        var data = this.getData();
        var index = data.reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            data.reservations[index].statut = "refusée";
            this.saveData(data);
            return true;
        }
        return false;
    }

    // Gestion de la personnalisation
    getPersonnalisation() {
        return this.getData().personnalisation || {};
    }

    updatePersonnalisation(personnalisation) {
        var data = this.getData();
        data.personnalisation = { ...data.personnalisation, ...personnalisation };
        this.saveData(data);
        return true;
    }
}

// Initialiser la base de données
var db = new Database();