document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products-container");
    const productForm = document.getElementById("product-form");
  
    // Função para carregar produtos
    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();
  
        productsContainer.innerHTML = ""; // Limpa o container antes de adicionar os produtos
  
        products.forEach((product) => {
          const productElement = document.createElement("div");
          productElement.classList.add("product");
          productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>R$ ${product.price}</p>
            <button class="delete-btn" data-id="${product.id}">Excluir</button>
          `;
          productsContainer.appendChild(productElement);
        });
  
        // Adicionar eventos de exclusão
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", deleteProduct);
        });
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
  
    // Função para adicionar um produto
    const addProduct = async (event) => {
        event.preventDefault();
      
        const name = document.getElementById("product-name").value;
        const price = parseFloat(document.getElementById("product-price").value); // Converte para número
        const image = document.getElementById("product-image").value;
      
        // Validação de formulário
        if (!name.trim() || isNaN(price) || price <= 0 || !image.startsWith("http")) {
          alert("Por favor, insira valores válidos!");
          return;
        }
      
        try {
          await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              price: price.toFixed(2), // Formata para 2 casas decimais
              image,
            }),
          });
      
          showMessage("Produto adicionado com sucesso!", "success"); // Mensagem de sucesso
          productForm.reset();
          loadProducts(); // Recarregar a lista de produtos
        } catch (error) {
          showMessage("Erro ao adicionar produto!", "error"); // Mensagem de erro
          console.error("Erro ao adicionar produto:", error);
        }
      };
      
  
    // Função para excluir um produto
    const deleteProduct = async (event) => {
      const productId = event.target.dataset.id;
  
      if (!confirm("Tem certeza que deseja excluir este produto?")) {
        return;
      }
  
      try {
        await fetch(`http://localhost:3000/products/${productId}`, {
          method: "DELETE",
        });
  
        showMessage("Produto excluído com sucesso!", "success"); // Mensagem de sucesso
        loadProducts(); // Recarregar a lista de produtos
      } catch (error) {
        showMessage("Erro ao excluir produto!", "error"); // Mensagem de erro
        console.error("Erro ao excluir produto:", error);
      }
    };
  
    // Função para mostrar mensagens de feedback
    const showMessage = (message, type) => {
      const messageElement = document.createElement("div");
      messageElement.textContent = message;
      messageElement.className = `message ${type}`;
      document.body.appendChild(messageElement);
  
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    };
  
    // Inicializar a aplicação
    loadProducts();
    productForm.addEventListener("submit", addProduct);
  });
  