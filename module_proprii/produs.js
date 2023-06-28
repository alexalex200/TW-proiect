class Produs{

    constructor({id, nume, descriere, pret,imagine, views, categ, colectii, elemente_nft, disponibilitate,data_adaugare}={}) {

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }

    }

}