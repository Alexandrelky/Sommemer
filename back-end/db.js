const mysql = require('mysql2');
// Função para criar a conexão
function connection_func() {
    console.log("Conectando...");
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sommemer'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Erro ao conectar ao banco de dados: ' + err.stack);
            return;
        }
        console.log('Conexão bem-sucedida com o ID: ' + connection.threadId);

        // Chama as funções para criar tabelas e realizar operações no banco
        create_tables(connection);
    });

    return connection; // Retorna a conexão para outros usos
}

// Função para criar tabelas
function create_tables(con) {
    console.log("Criando tabelas...");
    const sql_create_table_usuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INT NOT NULL AUTO_INCREMENT,
            nom_usuario VARCHAR(50) NOT NULL,
            ema_usuario VARCHAR(55) NOT NULL,
            end_usuario VARCHAR(100) NOT NULL,
            sen_usuario CHAR(15) NOT NULL,
            PRIMARY KEY (id_usuario)
        )
    `;

    const sql_create_table_produtos = `
        CREATE TABLE IF NOT EXISTS produtos (
            id_produto INT NOT NULL AUTO_INCREMENT,
            nom_produto VARCHAR(50) NOT NULL,
            val_produto DECIMAL(10, 2) NOT NULL,
            qtd_produto INT NOT NULL,
            img_produto VARCHAR(255),
            tipo_produto VARCHAR(50) NOT NULL,
            PRIMARY KEY (id_produto)
        )
    `;

    con.query(sql_create_table_usuarios, function (err, result) {
        if (err) {
            console.error("Erro ao criar tabela 'usuarios': ", err);
            return;
        }
        console.log("Tabela 'usuarios' criada com sucesso!");
    });

    con.query(sql_create_table_produtos, function (err, result) {
        if (err) {
            console.error("Erro ao criar tabela 'produtos': ", err);
            return;
        }
        console.log("Tabela 'produtos' criada com sucesso!");
    });
}

// Função para inserir usuários
function insert_user(con, nom_usuario, ema_usuario, end_usuario, sen_usuario) {
    console.log("Adicionando usuário...");
    const sql_insert_user = `
        INSERT INTO usuarios (nom_usuario, ema_usuario, end_usuario, sen_usuario) 
        VALUES (?, ?, ?, ?)
    `;

    con.query(sql_insert_user, [nom_usuario, ema_usuario, end_usuario, sen_usuario], function (err, result) {
        if (err) {
            console.error("Erro ao adicionar usuário: ", err);
            return;
        }
        console.log("Usuário adicionado com sucesso!");
    });
}

// Função para inserir produtos
function insert_product(con, nom_produto, val_produto, qtd_produto, img_produto, tipo_produto) {
    console.log("Adicionando produto...");
    const sql_insert_product = `
        INSERT INTO produtos (nom_produto, val_produto, qtd_produto, img_produto, tipo_produto) 
        VALUES (?, ?, ?, ?, ?)
    `;

    con.query(sql_insert_product, [nom_produto, val_produto, qtd_produto, img_produto, tipo_produto], function (err, result) {
        if (err) {
            console.error("Erro ao adicionar produto: ", err);
            return;
        }
        console.log("Produto adicionado com sucesso!");
    });
}

// Exportando as funções
module.exports = {
    connection_func,
    insert_user,
    insert_product
};

connection_func()