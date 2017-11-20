import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit{

  ngOnInit(): void {
    this.router.navigate(['admin'], {relativeTo: this.route});
  }

  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) {}

}
