import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { AuthserviceService } from 'src/app/model/service/authservice.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage implements OnInit {
  banners: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = []; // Adicionado para armazenar produtos filtrados
  isLoading: boolean = false;
  currentUserUID: string | null = null;
  searchActive: boolean = false; // Variável para controlar a visibilidade da barra de pesquisa
  searchTerm: string = ''; // Variável para armazenar o termo de pesquisa

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthserviceService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.currentUserUID = this.authService.currentUserUID;
  
    this.firebaseService.getAllProducts().subscribe((products: any[]) => {
      // Assuming the product data is properly fetched from Firebase
      this.products = products;
      this.filterByType('all'); // Filtrar todos os produtos inicialmente
      this.isLoading = false;
    });
  }  

  // Função para exibir detalhes do produto
  verDetalhes(product: any) {
    // Navegue para a página de detalhes do produto e passe o ID do produto como parâmetro
    this.navCtrl.navigateForward('/tabs/products/' + product.uid);
  }

  // Função para ativar/desativar a barra de pesquisa
  toggleSearch() {
    this.searchActive = !this.searchActive;
    this.searchTerm = ''; // Limpa o termo de pesquisa ao desativar a barra de pesquisa
    this.filterProducts(); // Atualiza a lista de produtos ao ativar/desativar a barra de pesquisa
  }

  // Função para filtrar os produtos com base no termo de pesquisa
  searchProducts() {
    this.filterProducts();
  }

  filterByType(type: string) {
    // Converter o tipo selecionado para minúsculas
    const typeLowerCase = type.toLowerCase();
  
    // Filtrar todos os produtos se o tipo for "all"
    if (typeLowerCase === 'all') {
      this.filteredProducts = [...this.products];
      return;
    }
  
    // Recuperar todos os documentos da coleção 'posts'
    this.firebaseService.getAllProducts().subscribe((posts: any[]) => {
      console.log('Todos os posts:', posts);
  
      // Verificar se algum dos posts corresponde ao tipo selecionado
      this.filteredProducts = posts.filter(post => {
        // Converter o tipo do post para minúsculas antes de comparar
        const postTypeLowerCase = post.type ? post.type.toLowerCase() : '';
        return postTypeLowerCase === typeLowerCase && // Comparar em minúsculas
          (!this.searchActive || this.searchTerm.trim() === '' ||
            post.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
      });
  
      console.log('Produtos filtrados:', this.filteredProducts);
    });
  }
  
  isFilterPressed(type: string): boolean {
    return this.filteredProducts.some(product => product.type === type);
  }  
  
  // Função para filtrar os produtos com base no termo de pesquisa e nos filtros de tipo
  private filterProducts() {
    if (this.searchActive && this.searchTerm.trim() !== '') {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products]; // Se a barra de pesquisa estiver desativada ou vazia, exibe todos os produtos
    }
  }
}
