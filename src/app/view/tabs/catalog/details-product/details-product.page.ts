import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details-product.page.html',
  styleUrls: ['./details-product.page.scss'],
})
export class DetailsPage implements OnInit {
  itemId: string | null = null; // Adicione | null
  item: any = null;

  constructor(
    private route: ActivatedRoute, // Importe ActivatedRoute corretamente
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => { // Use paramMap para obter o ID
      const id = params.get('id');
      if (id) {
        console.log('Item ID:', id); // Adiciona um log para verificar se o ID está correto
        this.itemId = id;
        this.loadItemDetails(this.itemId);
      } else {
        console.error('Item ID not found in route parameters.');
      }
    });
  }
  

  loadItemDetails(itemId: string) {
    console.log('Loading item details for ID:', itemId); // Adiciona um log para verificar se o ID está sendo passado corretamente
    this.firebaseService.getItemById(itemId).subscribe(
      (item: any) => { 
        console.log('Item details:', item); // Adiciona um log para verificar os detalhes do item
        this.item = item;
      },
      (error: any) => {
        console.error('Error loading item details:', error);
      }
    );
  }
}
