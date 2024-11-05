// src/app/shopping.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// Define the structure of a ShoppingItem
interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  purchased: boolean;
}

// Injectable service for managing shopping items
@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  // Private subject to hold the state of shopping items
  private itemsSubject = new BehaviorSubject<ShoppingItem[]>([]);
  // Observable to expose the state of shopping items
  items$ = this.itemsSubject.asObservable();
  // Counter to generate unique IDs for new items
  private nextId = 1;
  private apiUrl = 'your/api/url/here'; // Define the apiUrl property

  constructor(private http: HttpClient) {
    this.loadItems();
  }
  loadItems() {
    this.http.get<ShoppingItem[]>(this.apiUrl).subscribe(items => this.itemsSubject.next(items));
  }
  // Method to add a new shopping item
  addItem(name: string, quantity: number, category: string) {
    // Get the current state of items
    const items = this.itemsSubject.value;
    // Add a new item to the state with the next available ID
    items.push({ id: this.nextId++, name, quantity, category, purchased: false });
    // Update the state with the new item
    this.itemsSubject.next([...items]);
  }

  // Method to update an existing shopping item
  updateItem(id: number, name: string, quantity: number, category: string) {
    // Get the current state of items and update the item with the specified ID
    const items = this.itemsSubject.value.map(item =>
      item.id === id ? { ...item, name, quantity, category } : item
    );
    // Update the state with the updated item
    this.itemsSubject.next(items);
  }

  // Method to delete a shopping item by its ID
  deleteItem(id: number) {
    // Get the current state of items and filter out the item with the specified ID
    const items = this.itemsSubject.value.filter(item => item.id !== id);
    // Update the state with the filtered items
    this.itemsSubject.next(items);
  }

  // Method to toggle the 'purchased' status of a shopping item
  togglePurchased(id: number) {
    // Get the current state of items and toggle the 'purchased' status of the item with the specified ID
    const items = this.itemsSubject.value.map(item =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    // Update the state with the updated item
    this.itemsSubject.next(items);
  }

  // Method to filter shopping items by category
  filterByCategory(category: string) {
    // If 'All' is selected, return the full list of items
    if (category === 'All') return this.items$;
    // Otherwise, filter the items by the specified category
    return this.items$.pipe(map((items: ShoppingItem[]) => items.filter(item => item.category === category)));
  }
}
