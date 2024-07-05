import sequelize, { Sequelize } from 'sequelize'
const DB = new Sequelize({
    database:process.env.databasename,
    dialect:"postgres",
    host:process.env.hostname,
    password:process.env.dbpassword,
    port:Number(process.env.dbport),
    username:process.env.dbusername,
    logging:false
})
export default DB