import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { WellnessComponent } from './pages/wellness/wellness.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminRoomsComponent } from './pages/admin/rooms/admin-rooms.component';
import { AdminBookingsComponent } from './pages/admin/bookings/admin-bookings.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Hôtel Tanfous Beach & Aquapark - Accueil",
    },
    {
        path: "home",
        component: HomeComponent,
        title: "Hôtel Tanfous Beach & Aquapark - Accueil",
    },
    {
        path: "chambres",
        component: RoomsComponent,
        title: "Chambres - Hôtel Tanfous Beach & Aquapark",
    },
    {
        path: "restauration",
        component: RestaurantComponent,
        title: "Restauration - Hôtel Tanfous Beach & Aquapark",
    },
    {
        path: "loisirs-activites",
        component: ActivitiesComponent,
        title: "Loisirs & Activités - Hôtel Tanfous Beach & Aquapark",
    },
    {
        path: "bien-etre",
        component: WellnessComponent,
        title: "Bien-être - Hôtel Tanfous Beach & Aquapark",
    },
    {
        path: "reservation",
        component: BookingComponent,
        title: "Réservation - Hôtel Tanfous Beach & Aquapark",
        canActivate: [AuthGuard]
    },
    {
        path: "contact",
        component: ContactComponent,
        title: "Contact & Accès - Hôtel Tanfous Beach & Aquapark",
    },
    {
        path: "login",
        component: LoginComponent,
        title: "Login"
    },
    {
        path: "register",
        component: RegisterComponent,
        title: "Register"
    },
    {
        path: "admin",
        component: AdminComponent,
        title: "Admin Dashboard"
    },
    {
        path: "admin/rooms",
        component: AdminRoomsComponent,
        title: "Admin - Rooms Management"
    },
    {
        path: "admin/bookings",
        component: AdminBookingsComponent,
        title: "Admin - Bookings Management"
    },
    {
        path: "admin/users",
        component: AdminUsersComponent,
        title: "Admin - Users Management"
    }
];
