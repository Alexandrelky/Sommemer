const { connection_func, insert_product, insert_user} = require('../db');  // Importando a função de conexão e inserção de produto

// Estabelecendo a conexão com o banco
const connection = connection_func();  // Usando a função já existente de conexão

// Função para inserir um novo produto
function insertNewProduct(nom_produto, val_produto, qtd_produto, img_produto) {
    insert_product(connection, nom_produto, val_produto, qtd_produto, img_produto);
}

// Exemplo de uso: Inserir um produto

function insert_NewUser(nom_usuario, ema_usuario, end_usuario, sen_usuario) {
    insert_user(connection,nom_usuario, ema_usuario, end_usuario, sen_usuario);
}




//insert_NewUser("alexandre","xande@gmail.com","Ouro Preto", 123)


// function insertNewProduct(nom_produto, val_produto, qtd_produto, img_produto)

insertNewProduct('TESTESTE', 100.00 ,50, '');
