const express = require('express');
const recebe_dadosCad = require('./back-end/cadastro_login')


const app = express();
const recebe_dados = new recebe_dadosCad();

// Importando funções do db.js
const { connection_func } = require('./back-end/db');
const { message } = require('prompt');

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Certifique-se de criar a pasta 'views'



app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); // Para lidar com formulários URL encoded
// Criar conexão
const connection = connection_func(); 


//Apartir daqui é rotas

// Rota para exibir dados
app.get('/', (req, res) => {
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
            // Renderiza a página passando os dados
            res.render('index', { usuarios: usuarios, produtos: produtos});
        });
    });
});

// Rota Cadastro

app.get('/cadastro', (req, res)=>{
    res.render('cadastro')
})
app.post('/submit', (req, res) => {
    const { nome, email, endereco, senha } = req.body;

    recebe_dados.insertData(nome, email, endereco, senha);

    res.send('Dados inseridos com sucesso!');
});


//Rota para login

app.get('/login', (req, res) => {
    res.render('login');
});
//valida o login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    recebe_dados.validateUser(email, password, (err, isValid) => {
        if (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
    }
        if (isValid) {
            res.redirect('/'); 
            return;
        } else {
            res.redirect('/login')
            
        }
    });
});



// colocar o nome da pessoa dps que logar
// if(!nome){
//     botões login e cadastro
// } else{ botao nome}






// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
