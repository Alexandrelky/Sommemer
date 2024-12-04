const { connection_func } = require('./db'); 

class RecebeDadosCad {
    constructor() {
        this.DB = connection_func();  // Conectando ao banco de dados
    }

    // Método para inserir dados
    insertData(nome, email, endereco, senha) {
        const sql = `INSERT INTO usuarios (nom_usuario, ema_usuario, end_usuario, sen_usuario) 
                     VALUES (?, ?, ?, ?)`;
        const values = [nome, email, endereco, senha];

        this.DB.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados: ' + err);
                return;
            }
            console.log('Dados inseridos com sucesso!');
        });
    }

    // Método para validar o usuário
//     validateUser(email, senha, callback) {
//         const sql = `SELECT * FROM usuarios WHERE ema_usuario = ? AND sen_usuario = ?`;
//         const values = [email, senha];

//         this.DB.query(sql, values, (err, results) => {
//             if (err) {
//                 console.error('Erro ao validar usuário: ' + err);
//                 callback(err, null);
//                 return;
//             }
//             if (results.length > 0) {
//                 // Usuário encontrado
//                 callback(null, true);
//             } else {
//                 // Usuário não encontrado
//                 callback(null, false);
//             }
//         });
//     }
// }
validateUser(email, senha, callback) {
    const sql = `SELECT * FROM usuarios WHERE ema_usuario = ? AND sen_usuario = ?`;
    const values = [email, senha];

    this.DB.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao validar usuário: ' + err);
            callback(err, null);
            return;
        }
        if (results.length > 0) {
        // Usuário encontrado, retorna os dados do usuário (como nome e id)
            const user = results[0]; // Pega o primeiro resultado
            callback(null, { id: user.id_usuario, nome: user.nom_usuario });       
          } else {
            // Usuário não encontrado
            callback(null, false);
        }
    });
}
}



module.exports = RecebeDadosCad;
