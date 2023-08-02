const express = require("express");
const app = express();
const { PrismaClient } = require ("@prisma/client")
const multer = require("multer")
const path =require("path")

const storage= multer.diskStorage({
    destination:'./src/image/',
    filename:(req,file,cb) => {
        return cb(null,Date.now()+'-'+file.originalname)
    }
})

 const upload = multer({
    storage: storage
})


const prisma = new PrismaClient();

app.use(express.json());

app.get("/", async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
});

app.post("/", upload.single('image'),async (req, res) => {
    const { name } = req.body;
    const age = parseInt(req.body.age);
    const image_path = req.file.path; 
    const newUsers = await prisma.user.create({ 
         data: {
            name,
            age,
            image : image_path,
         },
    });
    res.json(newUsers);
});



app.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    const updateUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name: newName },
    });
    res.json(updateUser);
  });

app.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const jp = await prisma.user.findFirst({
            where: {
                id: id,
            }
        })
    if(!jp){
        return res.json({
            error: {
                message: "User not Found"
            }
        })
    }
    const updateUser = await prisma.user.delete({
        where: {
            id: id,
        }
    });
    res.json({
        success: {
            message: "user deleted successfully"
        }
    });
});
app.listen(3011, () => {
    console.log('Server running on port 3011')
});