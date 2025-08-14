// server.js (Versão 2)

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- "Banco de Dados" Simulado ---
const menuData = [
    { id: 1, name: "Margherita Especial", desc: "Molho de tomate San Marzano, muçarela de búfala, manjericão fresco e um fio de azeite extra virgem.", price: 45.00, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" },
    { id: 2, name: "Calabresa Artesanal", desc: "Molho de tomate, muçarela, fatias de calabresa artesanal levemente picante e anéis de cebola roxa.", price: 48.00, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2070&auto=format&fit=crop" },
    { id: 3, name: "La Fornalha da Casa", desc: "Muçarela, presunto de parma, lascas de parmesão, rúcula fresca e um toque de mel trufado.", price: 55.00, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1935&auto=format&fit=crop" },
    { id: 4, name: "Jardineira", desc: "Molho de tomate, muçarela, brócolis, tomate cereja, milho, azeitonas pretas e pimentão colorido.", price: 47.00, image: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?q=80&w=1935&auto=format=fit=crop" },
    { id: 5, name: "Frango com Catupiry®", desc: "Molho de tomate, muçarela, frango desfiado temperado e o autêntico requeijão cremoso Catupiry®.", price: 50.00, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format=fit=crop" },
    { id: 6, name: "Portuguesa Clássica", desc: "Molho, muçarela, presunto, ovos cozidos, ervilha, cebola e azeitonas verdes. Uma explosão de sabores.", price: 49.00, image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format=fit=crop" },
];

// NOVO: Lista para armazenar os pedidos recebidos. Em um app real, isso seria um banco de dados.
let orders = [];

// --- Rotas da API para o App do Cliente ---

app.get('/menu', (req, res) => {
  res.json(menuData);
});

app.post('/orders', (req, res) => {
  const orderData = req.body;
  
  // NOVO: Adicionamos mais detalhes ao pedido antes de salvar
  const newOrder = {
    id: Date.now(), // ID único baseado no tempo atual
    ...orderData,
    status: 'Novo', // Status inicial do pedido
    receivedAt: new Date().toLocaleTimeString('pt-BR') // Horário do recebimento
  };

  orders.push(newOrder);
  
  console.log(`--- NOVO PEDIDO RECEBIDO #${newOrder.id} ---`);
  console.log(newOrder);
  console.log('------------------------------------');
  
  res.status(201).json({ message: 'Pedido recebido com sucesso!', orderId: newOrder.id });
});

// --- NOVAS Rotas da API para o Painel do Administrador ---

// Rota para o painel buscar todos os pedidos
app.get('/admin/orders', (req, res) => {
    // Retorna os pedidos mais recentes primeiro
    res.json(orders.slice().reverse());
});

// Rota para atualizar o status de um pedido
app.post('/admin/orders/:id/status', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { newStatus } = req.body;

    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.status = newStatus;
        console.log(`Status do pedido #${orderId} atualizado para: ${newStatus}`);
        res.status(200).json({ message: 'Status atualizado com sucesso', order });
    } else {
        res.status(404).json({ message: 'Pedido não encontrado' });
    }
});


app.listen(PORT, () => {
  console.log(`Servidor da pizzaria (v2) rodando em http://localhost:${PORT}`);
});
