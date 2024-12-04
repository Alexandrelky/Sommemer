const { connection_func, insert_product, insert_user} = require('./db');  // Importando a função de conexão e inserção de produto

// Estabelecendo a conexão com o banco
const connection = connection_func();  // Usando a função já existente de conexão

// Função para inserir um novo produto
function insertNewProduct(nom_produto, val_produto, qtd_produto, img_produto, tipo_produto,horario, lugar_bebida, busca_oq, temperatura, sabor_bebida, sabor_alcool, opcao_preco,drink_tema, combinacoes_bebida) {
    insert_product(connection, nom_produto, val_produto, qtd_produto, img_produto, tipo_produto,horario, lugar_bebida, busca_oq, temperatura, sabor_bebida, sabor_alcool, opcao_preco,drink_tema, combinacoes_bebida);
}

// Exemplo de uso: Inserir um produto

function insert_NewUser(nom_usuario, ema_usuario, end_usuario, sen_usuario) {
    insert_user(connection,nom_usuario, ema_usuario, end_usuario, sen_usuario);
}





//insert_NewUser("alexandre","xande@gmail.com","Ouro Preto", 123)


// function insertNewProduct(nom_produto, val_produto, qtd_produto, img_produto)	

insertNewProduct('Whisky Old Parr 1L', 142.41 ,50,'https://m.media-amazon.com/images/I/51zz0lzNtuL._AC._SR360,460.jpg',"social","noite","importado","relaxar","quente","seco","forte","premium","nao","nao");

