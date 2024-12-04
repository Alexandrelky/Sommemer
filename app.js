const express = require('express');
const recebe_dadosCad = require('./back-end/cadastro_login')
const db = require("./back-end/db")
const session = require('express-session'); //bagulho do nome do usuario na tela apos logado


const app = express();
const recebe_dados = new recebe_dadosCad();

// Importando funções do db.js
const { connection_func } = require('./back-end/db');
const { message } = require('prompt');
// Criar conexão


// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', './views');



app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); // Para lidar com formulários URL encoded
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: false
})); // parte do bglh do nome usuario

 


//Apartir daqui é rotas

// // Rota para exibir dados
// app.get('/', (req, res) => {
//     // Primeira consulta: Buscar usuários
//     connection.query('SELECT * FROM usuarios', (err, usuarios) => {
//         if (err) {
//             console.error("Erro ao buscar usuários: ", err);
//             res.status(500).send("Erro ao buscar dados de usuários.");
//             return;
//         }
//         // Segunda consulta: Buscar produtos
//         connection.query('SELECT * FROM produtos', (err, produtos) => {
//             if (err) {
//                 console.error("Erro ao buscar produtos: ", err);
//                 res.status(500).send("Erro ao buscar dados de produtos.");
//                 return;
//             }
//             // Renderiza a página passando os dados
//             res.render('index', { usuarios: usuarios, produtos: produtos});
//         });
//     });
// });
app.get('/', (req, res) => {
    const user = req.session?.user || null; // Verifica se o usuário está logado
    
    // Primeira consulta: Buscar usuários
    connection.query('SELECT * FROM usuarios', (err, usuarios) => {
        if (err) {
            console.error("Erro ao buscar usuários: ", err);
            res.status(500).send("Erro ao buscar dados de usuários.");
            return;
        }
        // Segunda consulta: Buscar produtos
        connection.query('SELECT * FROM produtos', (err, produtos) => {
            if (err) {
                console.error("Erro ao buscar produtos: ", err);
                res.status(500).send("Erro ao buscar dados de produtos.");
                return;
            }
            // Renderiza a página passando os dados e o usuário logado
            const user = req.session.user || null;
            res.render('index', { usuarios, produtos, user });
        });
    });
});



// Inicio rota Cadastro

app.get('/cadastro', (req, res)=>{
    res.render('cadastro')
}) 
// PROCESSA cadastro
app.post('/submit', (req, res) => {
    const { nome, email, endereco, senha,  confirmar_senha } = req.body;
    if (senha !== confirmar_senha) {
        return res.render('cadastro', { error: 'As senhas não coincidem. Tente novamente.' });
    }
    recebe_dados.insertData(nome, email, endereco, senha);

    res.redirect('/login'); 
});

 // Fim rota cadastro

//Inicio rota login

// app.get('/login', (req, res) => {
//     res.render('login');
// });
// //valida o login
// app.post('/valida', (req, res) => {
//     const { email, password } = req.body;
//     recebe_dados.validateUser(email, password, (err, isValid) => {
//         if (err) {
//         res.status(500).json({ error: 'Erro interno do servidor' });
//         return;
//     }
//         if (isValid) {
//             res.redirect('/'); 
//             return;
//         } else {
//             res.redirect('/login')
//             console.log('deu erro mane')
//         }
//     });
// });
app.get('/login', (req, res) => {
    res.render('login');
});

// Valida o login
app.post('/valida', (req, res) => {
    const { email, password } = req.body;

    // Valida o login
    recebe_dados.validateUser(email, password, (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }

        if (user) { // se login for válido, retorna:
            req.session.user = { id: user.id, nome: user.nome }; // Salva o ID e o nome do usuário na sessão
            res.redirect('/');
        } else {
            res.redirect('/login');
            console.log('Login falhou.');
        }
    });
});
/// FIM rota login

//  INICIO rota logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); 
    });
});
//  FIM rota logout


// Inicio rota cosultoria
app.get('/consultoria', (req, res) => {
    res.render('consultoria', { bebidas: null });
});

// //processa a consulta

// app.post('/consultoria', (req, res) => {
//     const { tipo } = req.body;
    
//     // Query para buscar bebidas do tipo selecionado
//     const sql = 'SELECT * FROM produtos WHERE tipo_produto LIKE ?';
//     const values = [`%${tipo}%`];

//     connection.query(sql, values, (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar bebidas:', err);
//             res.status(500).send('Erro ao buscar bebidas');
//             return;
//         }

//         // Renderiza os resultados
//         res.render('consultoria', { bebidas: results });
//     });
// // });
// app.post('/consulta', (req, res) => {
//     const filters = req.body; // Pegamos todos os inputs do form de uma vez
//     const conditions = [];
//     const values = [];
// console.log(filters)
//     // Gerando condições dinamicamente
//     for (const key in filters) {
//         if (filters[key]) {
//             conditions.push(`${key} = ?`);
//             values.push(filters[key]);
//         }
//     }

//     // Construindo a query SQL
//     let sql = 'SELECT * FROM produtos';
//     if (conditions.length > 0) {
//         sql += ' WHERE ' + conditions.join(' AND '); // Adiciona condições com "AND"
//         console.log(sql);
//         console.log(conditions)
//         console.log(values)
//     }

//     // Executando a consulta
//     connection.query(sql, values, (err, results) => {
//         if (err) {
//             console.error('Erro ao buscar bebidas:', err);
//             return res.status(500).send('Erro ao buscar bebidas');
//         }

//         // Renderiza os resultados
//         res.render('consultoria', { bebidas: results });
//     });
// });
app.post('/consulta', (req, res) => {
    const filters = req.body; // Pegamos todos os inputs do form de uma vez
    const conditions = [];
    const values = [];

    // Gerando condições dinamicamente
    for (const key in filters) {
        if (filters[key]) {
            conditions.push(`${key} = ?`); // Adiciona a condição (campo = ?)
            values.push(filters[key]); // Adiciona o valor correspondente
        }
    }

    // Construindo a query SQL
    let sql = 'SELECT * FROM produtos';
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND '); // Adiciona condições com "AND"
    }

    console.log("SQL: ", sql);
    console.log("Conditions: ", conditions);
    console.log("Values: ", values);

    // Executando a consulta
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erro ao buscar bebidas:', err);
            return res.status(500).send('Erro ao buscar bebidas');
        }

        // Renderiza os resultados
        res.render('consultoria', { bebidas: results });
    });
});




// Fim rota consultoria 



// Inicia a Rota Compra
app.get('/compra/:id', (req, res) => {
    const produtoId = req.params.id;
    const sql = 'SELECT * FROM produtos WHERE id_produto = ?';

    connection.query(sql, [produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            res.status(500).send('Erro no servidor');
        } else if (results.length === 0) {
            res.status(404).send('Produto não encontrado');
        } else {
            res.render('compra', { produto: results[0] });
        }
    });
});

app.post('/finalizar-compra', (req, res) => {
    const { id_produto, quantidade } = req.body;

    const sql = 'UPDATE produtos SET qtd_produto = qtd_produto - ? WHERE id_produto = ?';
    connection.query(sql, [quantidade, id_produto], (err, results) => {
        if (err) {
            console.error('Erro ao finalizar a compra:', err);
            return res.status(500).send('Erro no servidor');
        }

        res.send('Compra finalizada com sucesso!');
    });
});


// Fim Rota compra




// colocar o nome da pessoa dps que logar
// if(!nome){
//     botões login e cadastro
// } else{ botao nome}






// Inicia o servidor
const connection = connection_func();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


