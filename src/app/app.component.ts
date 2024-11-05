// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingService } from './shopping.service';

// Component decorator to define the metadata for the component
@Component({
  selector: 'app-root', // Selector for the component
  standalone: true, // Indicates that the component is standalone
  imports: [CommonModule, FormsModule], // Importing necessary modules for the component
  template: `
    <div class="app-container">
      <h1>Shopping List</h1>

      <!-- Form to add/edit items -->
      <div class="form-group">
        <input [(ngModel)]="itemName" placeholder="Item name" />
        <input type="number" [(ngModel)]="itemQuantity" placeholder="Quantity" />
        <select [(ngModel)]="itemCategory">
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
        <button (click)="editingItemId ? updateItem() : addItem()">
          {{ editingItemId ? 'Update' : 'Add' }} Item
        </button>
      </div>

      <!-- Filter by category -->
      <div class="filter-group">
        <label>Filter by Category:</label>
        <select [(ngModel)]="filterCategory" (change)="applyFilter()">
          <option value="All">All</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
      </div>

      <!-- Item list -->
      <div class="item-list">
        <ul>
          <li *ngFor="let item of items">
            <span [class.purchased]="item.purchased">{{ item.name }} - {{ item.quantity }} ({{ item.category }})</span>
            <button (click)="togglePurchased(item.id)">Mark as {{ item.purchased ? 'Pending' : 'Purchased' }}</button>
            <button (click)="editItem(item)">Edit</button>
            <button (click)="deleteItem(item.id)">Delete</button>
          </li>
        </ul>
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <p>Total Items: {{ items.length }}</p>
        <p>Purchased Items: {{ purchasedCount }}</p>
        <p>Pending Items: {{ items.length - purchasedCount }}</p>
      </div>
    </div>
  `,
  styles: [`
    /* Add your styling here for a clean layout */
    .app-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .form-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .filter-group, .statistics {
      margin-top: 20px;
      font-size: 1.1em;
    }
    .item-list ul {
      list-style-type: none;
      padding: 0;
    }
    .item-list li {
      padding: 10px;
      border: 1px solid #ddd;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .purchased {
      text-decoration: line-through;
      color: #888;
    }
  `]
})
// Class for the component
export class AppComponent {
  items: any[] = []; // Use an array of any type or define a specific type
  purchasedCount = 0;
  itemName = '';
  itemQuantity = 1;
  itemCategory = 'Grocery';
  editingItemId: number | null = null;
  filterCategory = 'All';

  categories = ['Grocery', 'Electronics', 'Clothing', 'Household', 'Other']; // Array of categories

  // Constructor for the component
  constructor(private shoppingService: ShoppingService) {
    // Subscribe to the items observable and update the items array
    this.shoppingService.items$.subscribe((items: any[]) => {
      this.items = items; // Ensure items is assigned correctly
    }); // Removed the incorrect 'as' type assertion
  }

  // Method to add a new item
  addItem() {
    this.shoppingService.addItem(this.itemName, this.itemQuantity, this.itemCategory);
    this.resetForm();
  }

  // Method to update an existing item
  updateItem() {
    if (this.editingItemId !== null) {
      this.shoppingService.updateItem(this.editingItemId, this.itemName, this.itemQuantity, this.itemCategory);
      this.resetForm();
    }
  }

  // Method to delete an item
  deleteItem(id: number) {
    this.shoppingService.deleteItem(id);
  }

  // Method to toggle the 'purchased' status of an item
  togglePurchased(id: number) {
    this.shoppingService.togglePurchased(id);
  }

  // Method to edit an item
  editItem(item: any) {
    this.itemName = item.name;
    this.itemQuantity = item.quantity;
    this.itemCategory = item.category;
    this.editingItemId = item.id;
  }

  // Method to apply a filter to the items
  applyFilter() {
    this.shoppingService.filterByCategory(this.filterCategory).subscribe((items: any[]) => {
      this.items = items; // Ensure items is assigned correctly
    });
  }

  // Method to reset the form
  resetForm() {
    this.itemName = '';
    this.itemQuantity = 1;
    this.itemCategory = 'Grocery';
    this.editingItemId = null;
  }
}
