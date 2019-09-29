import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    /*Função para ser execultada antes de salvar os dados BD*/
    this.addHook('beforeSave', async user =>{
      /*verifica se create ou update*/
      if(user.password){
        /* Criptografa a senha, podendo ser 1 a 100, quanto maior + demorado*/
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    //retorna para função User
    return this;
  }

  /*Criando metodo de associação com avatar do usuário*/
  static associate(models){
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar'});
  }

  /*Metodo de verificação de senha da session com TOKEN*/
  checkePassword(password){
    return bcryptjs.compare(password, this.password_hash);
  }
}

export default User;
