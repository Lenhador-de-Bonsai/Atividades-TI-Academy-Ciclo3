const express = require('express');
const cors = require('cors');

const{Sequelize} = require('./models');
const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedidos = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto; 

app.get('/', function(req, res){
    res.send('olá, mundo!');
});

// criar um serviço no banco de dados
app.post('/servicos', async(req, res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    })
});

//mostra todos os serviços do banco de dados
app.get('/listaservicos', async(req, res) =>{
    await servico.findAll({
        // raw:  true
        order: [['nome', 'DESC']]
    }).then(function(servicos){
        res.json({servicos})
    }); 
});

//mostra o número de serviços existentes no banco de dados
app.get('/ofertaservicos', async(req, res) =>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

//procura um serviço específico no banco de dados
app.get('/servico/:id', async(req, res) =>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

//atualizar um serviço no banco de dados
app.put('/atualizaservico', async(req, res) =>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        }); 
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro na tentativa de alteração de serviço."
        });
    });
});

//Exlui um servico do banco de dados
app.get('/excluirservico/:id', async(req, res) =>{
    await servico.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o serviço."
        });
    });
});

// cria um pedido no banco de dados
app.post('/pedidos', async(req, res) =>{
    await pedidos.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "O pedido foi criado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        });
    });
});

// lista de pedidos no banco de dados
app.get('/listapedidos', async(req, res) =>{
    await pedidos.findAll({
        // raw: true
        order: [['dataPedido', 'DESC']]
    }).then(function(pedido){
        res.json({pedido})
    });
});

//procurar um pedido específico no banco de dados
app.get('/pedidos/:id', async(req, res) =>{
    await pedidos.findByPk(req.params.id)
    .then(ped =>{
        return res.json({
            error: false,
            ped
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

// exlcuir pedido do banco de dados
app.get('/excluirpedido/:id', async(req, res) =>{
    await pedidos.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "O pedido foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o pedido."
        });
    });
});

// criar um item para um pedido no banco de dados
app.post('/itempedidos', async(req, res) =>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "O item foi criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    })
});

// lista dos itens dos pedidos no banco de dados
app.get('/listaitenspedidos', async(req, res) =>{
    await itempedido.findAll({
        // raw:  true
        order: [['quantidade', 'DESC']]
    }).then(function(itens){
        res.json({itens})
    }); 
});

//alteração de itens de pedidos
app.put('/pedidos/:id/editaritem', async(req, res) =>{
    const item ={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await pedidos.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };

    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: "Serviço não foi encontrado"
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "O pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//adiconando um cliente ao banco de dados
app.post('/clientes', async(req, res) =>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "O cliente foi adicionado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível de conectar o cliente ao banco de dados."
        });
    });
});

//lista de clientes cadastrados
app.get('/listaclientes', async(req, res) =>{
    await cliente.findAll({
        // raw: true
        order: [['nome', 'DESC']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

//procurar um cliente específicos
app.get('/clientes/:id', async(req, res) =>{
    await cliente.findByPk(req.params.id)
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível achar o cliente!"
        });
    });
});

//atualizar o cliente no banco de dados
app.put('/atualizacliente', async(req, res) =>{
    await cliente.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        }); 
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro na tentativa de alteração de serviço."
        });
    });
});

//Exluindo o Cliente do banco de dados
app.get('/excluircliente/:id', async(req, res) =>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente."
        });
    });
});

// cria uma compra no banco de dados
app.post('/compras', async(req, res) =>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "A compra foi feita com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        });
    });
});

// lista de compras no banco de dados
app.get('/listacompras', async(req, res) =>{
    await compra.findAll({
        // raw: true
        order: [['data', 'DESC']]
    }).then(function(compra){
        res.json({compra})
    });
});

//procurar uma compra específica no banco de dados
app.get('/compras/:id', async(req, res) =>{
    await compra.findByPk(req.params.id)
    .then(comp =>{
        return res.json({
            error: false,
            comp
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

// exlcuir uma compra do banco de dados
app.get('/excluircompra/:id', async(req, res) =>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "A compra foi excluída com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a compra."
        });
    });
});

// criar um produto no banco de dados
app.post('/produtos', async(req, res) =>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "O produto foi criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    })
});

//mostra todos os produtos do banco de dados
app.get('/listaprodutos', async(req, res) =>{
    await produto.findAll({
        // raw:  true
        order: [['nome', 'DESC']]
    }).then(function(produtos){
        res.json({produtos})
    }); 
});

//mostra o número de produtos existentes no banco de dados
app.get('/ofertaprodutos', async(req, res) =>{
    await produto.count('id').then(function(produto){
        res.json({produto});
    });
});

//procura um produto específico no banco de dados
app.get('/produto/:id', async(req, res) =>{
    await produto.findByPk(req.params.id)
    .then(prod =>{
        return res.json({
            error: false,
            prod
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

//atualizar um produto no banco de dados
app.put('/atualizaproduto', async(req, res) =>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "O produto foi alterado com sucesso!"
        }); 
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro na tentativa de alteração de produto."
        });
    });
});

//Exlui um produto do banco de dados
app.get('/excluirproduto/:id', async(req, res) =>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "O produto foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o serviço."
        });
    });
});

// criar um item para uma compra no banco de dados
app.post('/itemcompras', async(req, res) =>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "O item foi criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    })
});

// lista dos itens das compras no banco de dados
app.get('/listaitenscompras', async(req, res) =>{
    await itemcompra.findAll({
        // raw:  true
        order: [['quantidade', 'DESC']]
    }).then(function(itens){
        res.json({itens})
    }); 
});

//alteração de itens de compras
app.put('/compras/:id/editaritem', async(req, res) =>{
    const item ={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "A compra não foi encontrada."
        });
    };

    if(!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: "O produto não foi encontrado"
        });
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "A compra foi alterada com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//porta de acesso à internet 
let port = process.env.PORT || 3001;

app.listen(port,(req, res) => {
    console.log('Servidor ativo: http://localhost:3001')
})