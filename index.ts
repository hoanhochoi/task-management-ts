import express,{Express} from "express";
import dotenv from "dotenv";
import cors from "cors"
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";
dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;
// deploy express typescript api
// https://dev.to/tirthpatel/deploy-node-ts-express-typescript-on-vercel-284h

// const  corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
// app.use(cors(corsOptions))
// cors
app.use(cors()
)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// lưu ý phải để trên routes
mainV1Routes(app);


app.listen(port,()=>{
    console.log(`app listening o port ${port}`)
})