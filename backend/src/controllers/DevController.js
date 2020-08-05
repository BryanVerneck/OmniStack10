const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// funções: index (listar), show (detalhar), store (criar), update (alterar), destroy (deletar)

// tipos de parametros: 
// Query params: request.query (Filtros, ordenação, paginação, ...) 
// Route params: request.params (identificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            } 
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }
    
        
    
        return response.json(dev);
    }
};