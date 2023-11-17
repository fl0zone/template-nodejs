const { request, response } = require('express');
const { v4: uuidv4} = require('uuid');

const { pool } = require('../database/config');
const { verifyJWT } = require('../helpers/generate-jwt');

const cloudinary = require('cloudinary').v2;
       
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET, secure: true });

const createTask = async ( req = request, res = response ) => {
    
    try {

        const task_id = uuidv4();
        const { x_token } = req.headers;
        const { title, description, start_date, finish_date } = req.body;
        const { tempFilePath } = req.files.img;
        const sd = new Date(start_date);
        const fd = new Date(finish_date);

        const { user_id } = await verifyJWT( x_token );

        if (user_id) {
          const query = `INSERT INTO tasks (task_id,title,description,img,start_date,finish_date,state,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
          const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {folder: 'project-task-manager'});
          await pool.query(query, [task_id,title,description,secure_url,sd,fd,'pendiente',user_id]);
  
          res.status(200).json({ ok: true });
        }

      } catch(error) {
        console.log(error);
        res.status(400).json({error})
      }

}

const getTasks = async ( req = request, res = response ) => {

  const { x_token } = req.headers;

  try {
    const { user_id } = await verifyJWT( x_token );

    if(user_id){
      const result = await pool.query('SELECT * FROM tasks WHERE user_id=$1',[user_id]);
      res.status(200).json({ok: true, data: result.rows});
    }
    
  } catch (error) {
    res.status(400).json({error});
  }
}

const getTask = async ( req = request, res = response ) => {

  const { x_token } = req.headers;
  const { task_id } = req.query;

  try {
    const user = await verifyJWT( x_token );

    if(user){
      const result = await pool.query('SELECT * FROM tasks WHERE task_id=$1',[task_id]);
      res.status(200).json({ok: true, data: result.rows[0]});
    }
    
  } catch (error) {
    res.status(400).json({error});
  }
}

const updateTask = async ( req = request, res = response ) => {

  const { x_token } = req.headers;
  const { task_id } = req.query;
  const { title, description, create_date, finish_date, secure_url } = req.body;
  const cd = new Date(create_date);
  const fd = new Date(finish_date);
  const nameImg = secure_url.split('/').at(-1);
  const { tempFilePath } = req.files.img;

  try {
    const user = await verifyJWT( x_token );

    if(user && task_id){
      const query = 'UPDATE tasks SET title=$1,description=$2,start_date=$3,finish_date=$4,img=$5 WHERE task_id=$6';
      await pool.query(query,[title,description,cd,fd,secure_url,task_id]);
      await cloudinary.uploader.destroy(`project-task-manager/${nameImg.split('.')[0]}`);
      await cloudinary.uploader.upload(tempFilePath, {folder: 'project-task-manager'})

      res.status(200).json({ok: true});
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json({error});
  }

}

const deleteTask = async ( req = request, res = response ) => {

    try {
        const { x_token } = req.headers;
        const { task_id, secure_url } = req.query;

        const user = await verifyJWT( x_token );

        if(user){
          const nameImg = secure_url.split('/').at(-1);
          await cloudinary.api.delete_resources([`project-task-manager/${nameImg.split('.')[0]}`], { type: 'upload', resource_type: 'image' })
          await pool.query('DELETE FROM tasks WHERE task_id=$1',[task_id]);
          res.status(200).json({ok: true});
        }

    } catch (error) {
      res.status(400).json({error});
    }
}


module.exports = {
    createTask,
    deleteTask,
    getTask,
    updateTask,
    getTasks
}