import sequelize, { Sequelize } from 'sequelize'
const DB = new Sequelize({
    database:"colab",
    dialect:"postgres",
    host:"localhost",
    password:"keyjo2803",
    port:8432,
    username:'postgres',
    logging:false
})
export default DB