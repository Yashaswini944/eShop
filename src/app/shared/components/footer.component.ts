import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-dark text-white mt-5 py-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-4">
            <h5>About eShop</h5>
            <p>Your trusted online shopping destination for quality products at great prices.</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="text-white-50 text-decoration-none">About Us</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">Contact</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">Terms & Conditions</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact Us</h5>
            <p class="text-white-50">
              Email: support&#64;eshop.com<br>
              Phone: 1-800-ESHOP-01<br>
              Address: 123 Commerce St, Online City
            </p>
          </div>
        </div>
        <hr class="bg-white-50">
        <div class="text-center text-white-50">
          <p>&copy; 2024 eShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }
    a:hover {
      color: white !important;
    }
  `]
})
export class FooterComponent {}