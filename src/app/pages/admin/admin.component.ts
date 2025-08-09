import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  stats = {
    totalRooms: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeBookings: 0
  };

  recentBookings: any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    let completedRequests = 0;
    const totalRequests = 3;

    const checkAllComplete = () => {
      completedRequests++;
      if (completedRequests >= totalRequests) {
        this.loading = false;
      }
    };

    // Load stats with error handling
    this.adminService.getRooms().subscribe({
      next: (data) => {
        this.stats.totalRooms = data.data?.length || 0;
        checkAllComplete();
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        checkAllComplete();
      }
    });

    this.adminService.getBookings().subscribe({
      next: (data) => {
        this.stats.totalBookings = data.data?.length || 0;
        this.stats.activeBookings = data.data?.filter((b: any) => 
          b.status === 'confirmed' || b.status === 'checked-in').length || 0;
        this.recentBookings = data.data?.slice(0, 5) || [];
        checkAllComplete();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        checkAllComplete();
      }
    });

    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.stats.totalUsers = data.data?.length || 0;
        checkAllComplete();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        checkAllComplete();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
