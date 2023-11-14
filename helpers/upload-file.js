const path = require('path');
const fs = require('fs');
const { v4: uuidv4} = require('uuid');
const { request, response } = require("express");

const cloudinary = require('cloudinary').v2;
       
cloudinary.config({ cloud_name: 'dav7kqayl', api_key: '874583229135966', api_secret: '6wCVwIWNtBuvC79zhbovqgrWD9A', secure: true });


const riseFile = async ( files, validExtensions = ['png','jpg','jpeg','gif'], folder = '' ) => {

    return new Promise ( (resolve, reject) =>{
        const { img } = files;
        const type = img.name.split('.');
        const extension = type[ type.length - 1];
    
        if( !validExtensions.includes( extension.toLowerCase() ) ){
            return reject(`The extension ${ extension } invalid - (${ validExtensions })`);
        }
    
        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, nameTemp );
  
        img.mv(uploadPath, (err) => {
            if (err) return reject(err);
            
            cloudinary.uploader.upload(uploadPath, {folder: 'project-task-manager'})
            .then( res => resolve(res) )
            .catch ((err) => console.log(err) );
            
        }); 

    })

}


module.exports = {
    cloudinary
}