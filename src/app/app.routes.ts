import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { WellnessComponent } from './pages/wellness/wellness.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ContactComponent } from './pages/contact/contact.component';

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
    },
    {
        path: "contact",
        component: ContactComponent,
        title: "Contact & Accès - Hôtel Tanfous Beach & Aquapark",
    },
];
