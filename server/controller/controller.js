var Userdb = require('../model/model');

module.exports={
create(req,res){
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"});
        return;
    }

    const user = new Userdb({
        nama:req.body.nama,
        suhu:req.body.suhu,
        TTL:req.body.TTL,
        usia:req.body.usia,
        jeniskelamin:req.body.jeniskelamin,
        noktp:req.body.noktp,
        alamat:req.body.alamat,
        nohp:req.body.nohp,
        email:req.body.email,
        keluhan:req.body.keluhan,
        penyakit:req.body.penyakit,
        hasil:req.body.hasil

    })

    user
    .save(user)
    .then(data=>{
     //res.send(data)
     res.redirect("/")
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"some error"
        });
    });
    },
    find(req, res){
        Userdb.find()
        .then(user=>{
            res.send(user)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error"})
        })
    },

    findById(req, res){
        console.log('id >>>', req.params.id)
        Userdb.findById(req.params.id).then(user => {
            res.send(user)
            
        }).catch(error => {
            res.status(404).send({message: error.message||"User not found"})
        })
    

    },

    update(req, res){
        if(!req.body){
            return res
            .status(400)
            .send({message : "Data to update cannot empty"})
        }
        const id = req.params.id;
        Userdb.findByIdAndUpdate(id, req.body, {useFindAndModify:false})
        .then(data=>{
            res.redirect("/")
        
        })
        .catch(err=>{
            res.status(500).send({message:"Error update user information"})
        })
    },

    delete(req, res){
        const id= req.params.id;

        Userdb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message: `Cannot delete with id ${id}. wrong`})
            }else{

                res.send({
                    message:"User was deleted"
                })
            }
        })
        .catch(err=>{
            res.status(500).send({
                message:"could not delete user with id=" +id
            });
        });

    }    

}